import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() data : {email:string; password:string;name:string; role: 'lecturer' | 'student'}) {
        return this.authService.register(data);
    }

    @Post('login')
    login(@Body() data: { email: string; password: string }) {
        return this.authService.login(data);
    }

    @Post('verify-otp')
    verifyOtp(@Body() data: { email: string; otp: string }) {
        return this.authService.verifyOtp(data);
    }
}
