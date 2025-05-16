import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateDepartmentDto {
    @ApiProperty({
        example: 'Web Development',
        description: 'Name of the department (2 to 100 characters).',
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100, {
        message: 'The name must be between 2 and 100 characters long.',
    })
    name: string;

    @ApiProperty({
        example: 'WEBDEV',
        description: 'Unique short code for the department (2 to 20 characters).',
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100, {
        message: 'The code must be between 2 and 20 characters long.',
    })
    code: string;

    @ApiProperty({
        example: 'Handles all frontend and backend projects.',
        required: false,
        description: 'Optional description of the department.',
    })
    @IsString()
    @IsOptional()
    description?: string;
}

