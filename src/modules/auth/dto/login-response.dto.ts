import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Access token (JWT)' })
    accessToken: string;

    @ApiProperty({ example: 'd4f1...refreshToken...', description: 'Refresh token (JWT)' })
    refreshToken: string;
}
