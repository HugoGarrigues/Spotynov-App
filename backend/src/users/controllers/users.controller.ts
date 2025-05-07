import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users') // ➜ Catégorie Swagger
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Créer un utilisateur' })
    @ApiResponse({ status: 201, description: 'Utilisateur créé' })
    @ApiBody({ type: CreateUserDto })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
    @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':username')
    @ApiOperation({ summary: "Récupérer un utilisateur par son Username" })
    @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    @ApiParam({ name: 'username', type: String })
    findOne(@Param('username') username: string) {
        return this.usersService.findOne(username);
    }
    
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
    @ApiParam({ name: 'id', type: Number })
    remove(@Param('id') id: number) {
        return this.usersService.remove(+id);
    }
}
