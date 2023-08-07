import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AWS } from '@config';
import { AppController } from './app.controller';
import { AppService } from 'app.service';
import { User } from 'entity/user';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: AWS.RDS.host,
      port: AWS.RDS.port,
      username: AWS.RDS.username,
      password: AWS.RDS.password,
      database: AWS.RDS.database,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
