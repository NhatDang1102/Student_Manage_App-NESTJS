import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    async register(dto : {email:string; password:string;name:string; role: 'lecturer' | 'student'}) {
       const userExists = await this.usersRepository.findOne({ where: { email: dto.email } });
       if (userExists) {
              throw new BadRequestException('User already exists');
         }

         const hashedPassword = await bcrypt.hash(dto.password, 10);
            const newUser = this.usersRepository.create({
                ...dto,
                password: hashedPassword,
            });
            await this.usersRepository.save(newUser);   
            return newUser;

    }
    

}
