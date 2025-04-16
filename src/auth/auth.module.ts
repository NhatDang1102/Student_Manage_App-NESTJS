import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TempUsers } from '../entities/TempUsers';
import { MailService } from './mail.service';
@Module({
  
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Users, TempUsers]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService]
  
})
export class AuthModule {}
