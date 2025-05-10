import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../models/users.models';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../../users.json');

@Injectable()
export class UsersService {
  private readFile(): User[] {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
  }

  public writeFile(data: User[]) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  findAll(): User[] {
    return this.readFile();
  }

  async findOne(username: string): Promise<User | undefined> {
    const users = this.readFile();
    const found = users.find(user => user.username === username);
    return found;
  }

  create(createUserDto: CreateUserDto): User {
    const users = this.readFile();

    const existing = users.find(user => user.username === createUserDto.username);
    if (existing) {
      throw new BadRequestException('Nom d’utilisateur déjà utilisé');
    }

    const newUser: User = {
      ...createUserDto,
      groupName: null,
      isGroupLeader: false,
      spotifyAccessToken: null,
      spotifyRefreshToken: null,
      spotifyUserId: null,
    };

    users.push(newUser);
    this.writeFile(users);
    return newUser;
  }

  update(username: string, updateUserDto: UpdateUserDto): User {
    const users = this.readFile();
    const index = users.findIndex(u => u.username === username);
    if (index === -1) throw new NotFoundException(`Utilisateur ${username} non trouvé`);

    users[index] = { ...users[index], ...updateUserDto };
    this.writeFile(users);
    
    return users[index];
  }

  remove(username: string): void {
    const users = this.readFile();
    const updated = users.filter(u => u.username !== username);
    if (users.length === updated.length) {
      throw new NotFoundException(`Utilisateur ${username} non trouvé`);
    }
    this.writeFile(updated);
  }

  async updateSpotifyTokens(username: string, accessToken: string, refreshToken: string, spotifyUserId?: string) {
    const users = await this.findAll();
    const user = users.find(u => u.username === username);
    if (!user) return;
  
    user.spotifyAccessToken = accessToken;
    user.spotifyRefreshToken = refreshToken;
    if (spotifyUserId) user.spotifyUserId = spotifyUserId;
  
    await this.writeFile(users);
  }

}
