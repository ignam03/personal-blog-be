import { Global, Module } from '@nestjs/common';
import { HttpCustomService } from './http/http.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpCustomService],
  exports: [HttpCustomService],
})
export class ProvidersModule {}
