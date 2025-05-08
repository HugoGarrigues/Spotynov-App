import { Body, Controller, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { GroupsService } from './services/groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';


@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Créer un groupe' })
  @ApiResponse({ status: 201, description: 'Groupe créé' })
  create(@Req() req, @Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(req.user.username, dto.groupName);
  }

  @Post('join')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rejoindre un groupe' })
  @ApiResponse({ status: 200, description: 'Rejoint le groupe avec succès' })
  join(@Req() req, @Body() dto: JoinGroupDto) {
    return this.groupsService.joinGroup(req.user.username, dto.groupName);
  }

  @Post('leave')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Quitter un groupe' })
  @ApiResponse({ status: 200, description: 'A quitté le groupe avec succès' })
  leave(@Req() req) {
    return this.groupsService.leaveGroup(req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les groupes' })
  @ApiResponse({ status: 200, description: 'Liste des groupes' })
  list() {
    return this.groupsService.getAllGroups();
  }

  @Get(':groupName')
  @ApiOperation({ summary: 'Obtenir les détails d\'un groupe' })
  @ApiResponse({ status: 200, description: 'Détails du groupe' })
  getGroupDetails(@Param('groupName') groupName: string) {
    return this.groupsService.getGroupDetails(groupName);
  }

}
