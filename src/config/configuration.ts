import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    PORT: number;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    DATABASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config);
    const errors = validateSync(validatedConfig);

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}