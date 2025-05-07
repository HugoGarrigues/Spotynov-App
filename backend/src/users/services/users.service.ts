import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../models/users.models';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../users.json');

@Injectable()
export class UsersService {
  private readFile(): User[] {
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
  }

  private writeFile(data: User[]) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  findAll(): User[] {
    return this.readFile();
  }

  async findOne(username: string) {
    const users = await this.readFile();
    return users.find(user => user.username === username);
  }
  

  create(createUserDto: CreateUserDto): User {
    const users = this.readFile();
    const newUser: User = {
      id: Date.now(),
      ...createUserDto,
    };
    users.push(newUser);
    this.writeFile(users);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const users = this.readFile();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException(`User ${id} not found`);
    users[index] = { ...users[index], ...updateUserDto };
    this.writeFile(users);
    return users[index];
  }

  remove(id: number): void {
    let users = this.readFile();
    users = users.filter(u => u.id !== id);
    this.writeFile(users);
  }
}
