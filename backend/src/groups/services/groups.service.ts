import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../../users/models/users.models';
import axios from 'axios';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { SpotifyProfile, SpotifyCurrentlyPlaying } from '../../spotify/models/spotify.model';

const USERS_FILE = path.join(__dirname, '../../users.json');

@Injectable()
export class GroupsService {

  private async readUsersFile(): Promise<User[]> {
    if (!fs.existsSync(USERS_FILE)) return [];
    const content = await fs.promises.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  }

  private async writeUsersFile(users: User[]): Promise<void> {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  private findUserIndex(users: User[], username: string): number {
    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
      throw new NotFoundException(`Utilisateur '${username}' non trouvé`);
    }
    return index;
  }

  private assignNewLeader(users: User[], groupName: string, excludingUsername: string): void {
    const candidates = users.filter(u => u.groupName === groupName && u.username !== excludingUsername);
    if (candidates.length > 0) {
      const newLeaderIndex = users.findIndex(u => u.username === candidates[0].username);
      users[newLeaderIndex] = { ...users[newLeaderIndex], isGroupLeader: true };
    }
  }

  async createGroup(username: string, groupName: string) {
    const users = await this.readUsersFile();
    const userIndex = this.findUserIndex(users, username);

    const groupAlreadyExists = users.some(u => u.groupName === groupName);
    if (groupAlreadyExists) {
      throw new ConflictException(`Un groupe nommé '${groupName}' existe déjà`);
    }

    if (users[userIndex].groupName) {
      await this.leaveGroup(username);
    }

    const updatedUsers = await this.readUsersFile();
    const updatedUserIndex = this.findUserIndex(updatedUsers, username);

    updatedUsers[updatedUserIndex] = {
      ...updatedUsers[updatedUserIndex],
      groupName,
      isGroupLeader: true,
    };

    await this.writeUsersFile(updatedUsers);

    return {
      message: `Groupe '${groupName}' créé avec succès`,
      admin: username,
    };
  }

  async joinGroup(username: string, groupName: string) {
    const users = await this.readUsersFile();
    const userIndex = this.findUserIndex(users, username);
    const user = users[userIndex];

    const groupExists = users.some(u => u.groupName === groupName);
    if (!groupExists) {
      throw new NotFoundException(`Groupe '${groupName}' non trouvé`);
    }

    const oldGroupName = user.groupName;
    const wasLeader = user.isGroupLeader;

    users[userIndex] = {
      ...user,
      groupName,
      isGroupLeader: false,
    };

    if (wasLeader && oldGroupName) {
      this.assignNewLeader(users, oldGroupName, username);
    }

    await this.writeUsersFile(users);

    return {
      message: `Utilisateur '${username}' a rejoint le groupe '${groupName}'`,
    };
  }

  async leaveGroup(username: string) {
    const users = await this.readUsersFile();
    const userIndex = this.findUserIndex(users, username);
    const user = users[userIndex];

    if (!user.groupName) {
      throw new ConflictException(`L'utilisateur '${username}' n'est pas dans un groupe`);
    }

    const oldGroupName = user.groupName;
    const wasLeader = user.isGroupLeader;

    users[userIndex] = {
      ...user,
      groupName: undefined,
      isGroupLeader: false,
    };

    if (wasLeader && oldGroupName) {
      this.assignNewLeader(users, oldGroupName, username);
    }

    await this.writeUsersFile(users);

    return {
      message: `Utilisateur '${username}' a quitté le groupe '${oldGroupName}'`,
    };
  }

  async getAllGroups() {
    const users = await this.readUsersFile();

    const groupNames = Array.from(new Set(users.map(user => user.groupName).filter(Boolean)));

    const groups = groupNames.map(groupName => ({
      groupName,
      userCount: users.filter(user => user.groupName === groupName).length,
    }));

    if (groups.length === 0) {
      throw new NotFoundException('Aucun groupe trouvé');
    }

    return groups;
  }

  async getGroupDetails(groupName: string, requestingUsername: string) {
    const users = await this.readUsersFile();
    const requestingUser = users.find(u => u.username === requestingUsername);
    const groupMembers = users.filter(user => user.groupName === groupName);
  
    if (!requestingUser || requestingUser.groupName == null) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à consulter ce groupe.");
    }
  
    if (groupMembers.length === 0) {
      throw new NotFoundException(`Aucun utilisateur trouvé dans le groupe ${groupName}`);
    }
  
    const membersDetails = await Promise.all(
      groupMembers.map(async (member) => {
        const { username, isGroupLeader, spotifyAccessToken } = member;
        const result: any = { username, isGroupLeader };
  
        if (!spotifyAccessToken) return result;
  
        try {
          const profileRes = await axios.get<SpotifyProfile>(
            'https://api.spotify.com/v1/me',
            { headers: { Authorization: `Bearer ${spotifyAccessToken}` } }
          );
          result.spotifyUsername = profileRes.data.display_name;
  
          const playingRes = await axios.get<SpotifyCurrentlyPlaying>(
            'https://api.spotify.com/v1/me/player/currently-playing',
            { headers: { Authorization: `Bearer ${spotifyAccessToken}` } }
          );
  
          const item = playingRes.data?.item;
          if (playingRes.status === 200 && item) {
            result.currentTrack = {
              title: item.name,
              artist: item.artists.map(a => a.name).join(', '),
              album: item.album.name,
            };
            result.device = playingRes.data.device?.name ?? null;
          }
        } catch (error) {
          console.error(`Erreur Spotify pour l'utilisateur ${username}:`, error.message);
        }
  
        return result;
      })
    );
  
    return { groupName, members: membersDetails };
  }
  

}
