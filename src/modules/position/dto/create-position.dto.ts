import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, Max, IsBoolean } from 'class-validator';

export class CreatePositionDto {
    @ApiProperty({
        example: 'Senior Software Engineer',
        description: 'Title of the position, e.g., Software Engineer, CTO',
    })
    @IsString({ message: 'Title must be a string.' })
    title: string;

    @ApiProperty({
        example: 2,
        default: 1,
        description: 'Hierarchy level of the position (1 = highest). Range: 1–10.',
    })
    @IsInt({ message: 'Level must be an integer.' })
    @Min(1, { message: 'Level cannot be less than 1.' })
    @Max(10, { message: 'Level cannot be greater than 10.' })
    @IsOptional()
    level?: number = 1;

    @ApiProperty({
        example: 1,
        required: false,
        description: 'ID of the parent position (e.g., manager or supervisor)',
    })
    @IsInt({ message: 'Parent ID must be an integer.' })
    @IsOptional()
    parentId?: number;

    @ApiProperty({
        example: 'Handles technical design and mentoring junior developers',
        required: false,
        description: 'Optional description of the position responsibilities',
    })
    @IsString({ message: 'Description must be a string.' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: false,
        default: false,
        description: 'Whether this is an executive-level position (e.g., CTO, CEO)',
    })
    @IsBoolean({ message: 'isExecutive must be a boolean.' })
    @IsOptional()
    isExecutive?: boolean = false;
}

