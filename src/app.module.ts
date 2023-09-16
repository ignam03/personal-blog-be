import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArchivesModule } from './modules/archives/archives.module';
import { SharedModule } from './modules/shared/shared.module';
import { StorageModule } from './modules/storage/storage.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TestModule } from './modules/test/test.module';

@Global()
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [User],
    }),
    ArticlesModule,
    UsersModule,
    AuthModule,
    ArchivesModule,
    SharedModule,
    StorageModule,
    ConfigModule.forRoot({
      envFilePath: '.develop.env',
      //envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      //load: [configuration],
    }),
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
