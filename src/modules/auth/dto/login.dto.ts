import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'mahfuzislam1695@gmail.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '12345678', description: 'User password' })
    @IsString()
    password: string;
}


