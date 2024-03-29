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
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TestModule } from './modules/test/test.module';
import { DatabaseModule } from './config/databaseModule';
import { CommentsModule } from './modules/comments/comments.module';
import { RouterModule } from '@nestjs/core';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MailModule } from './modules/mail/mail.module';

@Global()
@Module({
  imports: [
    //SequelizeModule.forRoot({ ...databaseProviders }),
    ArticlesModule,
    UsersModule,
    AuthModule,
    ArchivesModule,
    SharedModule,
    StorageModule,
    DatabaseModule,
    ConfigModule.forRoot({
      // envFilePath: '.env',
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      //load: [configuration],
    }),
    TestModule,
    CommentsModule,
    CloudinaryModule,
    MailModule,
    // RouterModule.register([
    //   {
    //     path: 'comments',
    //     module: CommentsModule,
    //     children: [
    //       {
    //         path: 'article/:articleId',
    //         module: TestModule,
    //       },
    //     ],
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
