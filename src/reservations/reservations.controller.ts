import { ReservationsService } from './reservations.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ReservationRequest } from './models/reservation-request.model';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  isAvailable(@Query() query: ReservationRequest): Promise<boolean> {
    return this.reservationsService.isAvailable(
      query.resourceId,
      query.date,
      query.hour,
    );
  }
}
