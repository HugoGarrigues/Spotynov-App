import { Module } from '@nestjs/common';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './groups.controller';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
