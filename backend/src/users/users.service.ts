import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

const USERS_FILE = path.join(__dirname, '../../data/users.json');

@Injectable()
export class UsersService {

  findAll() {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  findOne(id: number) {
    const users = this.findAll();
    return users.find(user => user.id === id);
  }

  private writeUsers(data: any) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  create(createUserDto: CreateUserDto) {
    const users = this.findAll();
    const newUser = {
      id: Date.now(),
      ...createUserDto,
    };
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
