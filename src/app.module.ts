import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductionLinesModule } from './production-lines/production-lines.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Reads the .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // MySQL connection through TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'smart_factory_db'),
        // Load every *.entity file, so relations to entities whose module
        // is not built yet (e.g. User -> ProductionRecord) still resolve
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        // creates/updates tables from entities (development only)
        synchronize: config.get('DB_SYNC') === 'true',
      }),
    }),

    // Default rate limit store (used by the login route)
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    AuthModule,
    UsersModule,
    ProductionLinesModule,
  ],
  providers: [
    // Order matters: 1) who are you? (JWT)  2) are you allowed? (role)
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
