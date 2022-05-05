import { ReservationsService } from './reservations.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  isAvailable(@Query() query): Promise<boolean> {
    return this.reservationsService.isAvailable(query.resourceId, query.date);
  }
}
