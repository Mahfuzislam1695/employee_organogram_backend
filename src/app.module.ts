import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "./common/logger/logger.module";
import { HealthModule } from "./health/health.module";
import { DepartmentModule } from "./modules/department/department.module";
import { PositionsModule } from "./modules/position/position.module";
import { EmployeesModule } from "./modules/employee/employee.module";
import { UserModule } from "./modules/user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "./modules/auth/auth.module";



@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,      // Reset counter after 60 seconds
      limit: 100,   // Allow 100 requests per IP in 60s
    }]),
    LoggerModule,
    HealthModule,
    DepartmentModule,
    PositionsModule,
    EmployeesModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
