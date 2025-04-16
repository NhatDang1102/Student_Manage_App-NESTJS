import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { TempUsers } from '../entities/TempUsers';
import { MailService } from './mail.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(TempUsers)
        private tempUsersRepository: Repository<TempUsers>,
   
        private jwtService: JwtService,
        private mailService: MailService
    ) {}

    async register(dto : {email:string; password:string;name:string; role: 'lecturer' | 'student'}) {
       const userExists = await this.usersRepository.findOne({ where: { email: dto.email } });
       if (userExists) {
              throw new BadRequestException('User already exists');
         }

         const otp = Math.floor(100000 + Math.random() * 900000).toString();

         const hashedPassword = await bcrypt.hash(dto.password, 10);

         const tempUser = this.tempUsersRepository.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: dto.role,
            otpCode: otp,
            otpExpiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
          });
            await this.tempUsersRepository.save(tempUser);   

            await this.mailService.sendOtp(dto.email, otp);
            return { message: 'OTP sent to your email' };
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

       if(user.role !== 'lecturer') throw new BadRequestException('You are not allowed to login as a student!!!');
           
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
    
    async  verifyOtp(dto: {email: string, otp: string}) {
        const tempUser = await this.tempUsersRepository.findOne({ where: {email: dto.email } });
        if (!tempUser || tempUser.otpCode !== dto.otp) {
            throw new BadRequestException('Invalid OTP or email');
        }

        if (!tempUser.otpExpiredAt || tempUser.otpExpiredAt < new Date()) {
            throw new BadRequestException('OTP expired');
            throw new BadRequestException('Invalid OTP or email');
        }

        const user = this.usersRepository.create({
            email: tempUser.email,
            password: tempUser.password,
            name: tempUser.name,
            role: tempUser.role,
        });

        await this.usersRepository.save(user);
        await this.tempUsersRepository.delete({email:dto.email}); 

        return { message: 'OTP correct, regis successful' };
    }

}
