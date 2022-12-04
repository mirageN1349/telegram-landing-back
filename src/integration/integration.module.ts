import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Module({
  providers: [IntegrationService],
})
export class IntegrationModule {}
