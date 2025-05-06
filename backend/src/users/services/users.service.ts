import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private usersFilePath = path.join(__dirname, '..', 'users.json');  

  private readUsersFromFile() {
    if (!fs.existsSync(this.usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(this.usersFilePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeUsersToFile(users: any[]) {
    fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  }

  createUser(username: string, password: string) {
    const users = this.readUsersFromFile();
    const newUser = { username, password };  
    users.push(newUser);
    this.writeUsersToFile(users);
    return newUser;
  }

  findOne(username: string) {
    const users = this.readUsersFromFile();
    return users.find(user => user.username === username);
  }
}
