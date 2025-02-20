import { Global, Module } from '@nestjs/common';
import { ResponseService } from './response.service';

@Global()
@Module({
  exports: [ResponseService],
})
export class ResponseModule {}
