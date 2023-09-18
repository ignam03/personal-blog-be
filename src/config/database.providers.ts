import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Article } from 'src/modules/articles/entities/article.entity';
import { User } from 'src/modules/users/entities/user.entity';

ConfigModule.forRoot({
  envFilePath: '.develop.env',
});

const configService = new ConfigService();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT')) || 5432,
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        ssl: configService.get<string>('DB_DIALECT') === 'true',
        dialectOptions: {
          ssl: true,
          native: true,
        },
      });
      sequelize.addModels([User, Article]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
