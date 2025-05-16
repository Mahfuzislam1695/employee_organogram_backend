import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckService,
    HealthCheckResult,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './indicators/database.health';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('System')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private dbHealth: DatabaseHealthIndicator,
        private memoryHealth: MemoryHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    @ApiOkResponse({ type: HealthResponseDto })
    @ApiInternalServerErrorResponse({ description: 'Service Unhealthy' })
    async check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.dbHealth.isHealthy(),
            // () => this.memoryHealth.checkHeap('heap', 80),
        ]);
    }
}