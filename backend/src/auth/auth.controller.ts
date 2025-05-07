import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 201, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginAuthDto })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' }) 
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Déconnexion utilisateur',
    description:
      "Cette route ne supprime pas le token côté serveur, mais informe le client de le supprimer de son côté.",
  })
  @ApiResponse({
    status: 200,
    description: "Déconnexion réussie. Veuillez supprimer votre token JWT côté client.",
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()            
  @Post('logout')
  async logout(@Request() req) {
    return {
      message:
        "Déconnexion réussie. Veuillez supprimer votre token JWT du stockage local.",
      user: req.user }
    }
  }