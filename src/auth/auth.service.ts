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
        private jwtService: JwtService,
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

    async login(dto: { email: string; password: string }) {
        const user = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid credentials');
        }

       if(user.role !== 'lecturer') throw new BadRequestException('You are not allowed to login as a student');
           
            const payload = { email: user.email, sub: user.id, role: user.role };
            const token = this.jwtService.sign(payload);
            return {
                access_token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
       
    }
    

}
