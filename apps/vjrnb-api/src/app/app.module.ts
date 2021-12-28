import { CacheModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexService } from './knex.service';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10 * 60
    })
  ],
  controllers: [
    AppController,
    SongsController
  ],
  providers: [
    AppService,
    KnexService,
    SongsService
  ],
})
export class AppModule {}
