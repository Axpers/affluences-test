import { ReservationsController } from './reservations.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [HttpModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
