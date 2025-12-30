import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PluralSnakeNamingStrategy } from './plural-snake-naming.strategy';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const dbConfig = this.configService.get('db');
        return {
            type: dbConfig.type,
            host: dbConfig.host,
            username: dbConfig.username,
            password: dbConfig.password,
            port: dbConfig.port,
            database: dbConfig.type === 'sqlite' ? dbConfig.path : dbConfig.name,
            migrationsRun: dbConfig.migrationsRun,
            synchronize: dbConfig.synchronize,
            logging: dbConfig.logging,
            autoLoadEntities: true,
            namingStrategy: new PluralSnakeNamingStrategy(),
        };
    }
}
