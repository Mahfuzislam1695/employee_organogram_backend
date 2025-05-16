import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class MemoryHealthIndicator extends HealthIndicator {
    async checkHeap(): Promise<HealthIndicatorResult> {
        const heapUsed = process.memoryUsage().heapUsed / 1024 / 1024;
        const healthy = heapUsed < 500; // Alert if >500MB
        return this.getStatus('memory_heap', healthy, { heapUsed: `${heapUsed.toFixed(2)}MB` });
    }
}