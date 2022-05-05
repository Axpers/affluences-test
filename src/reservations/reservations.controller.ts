import { ReservationsService } from './reservations.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ReservationQuery } from './models/reservation-query.model';
import { Response } from './models/response.model';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async isAvailable(@Query() query: ReservationQuery) {
    try {
      const result = await this.reservationsService.isAvailable(
        query.resourceId,
        query.date,
        query.hour,
      );

      const response: Response = {
        available: result,
      };

      return response;
    } catch (e) {
      throw e;
    }
  }
}
