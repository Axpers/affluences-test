import { TimeTablesResult } from './models/timetables.model';
import { ReservationResult } from './models/reservation.model';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReservationsService {
  private acceptedIds: number[] = [1337];
  private reservationServiceUrl = `http://localhost:8080`;

  constructor(private httpService: HttpService) {}

  isValidDate(date: string) {
    // Check if match
    return true;
  }

  async isAvailable(inputResourceId: string, date: string): Promise<any> {
    const resourceId = Number(inputResourceId);

    // Check if date and ressource are valid, and if it has an hour
    if (this.acceptedIds.includes(resourceId) && this.isValidDate(date)) {
      const openedSlots = await this.fetchOpenedSlots(resourceId, date);
      const timeTables = await this.fetchTimeTables(resourceId, date);

      return timeTables;

      // Compare if input date match both ressources
    } else {
      throw new BadRequestException('Id or date are invalid');
    }
  }

  private async fetchOpenedSlots(
    resourceId: number,
    date: string,
  ): Promise<ReservationResult> {
    const dateWithoutHour = date;

    const result = await lastValueFrom(
      this.httpService.get(
        `${this.reservationServiceUrl}/reservations?date=${dateWithoutHour}&resourceId=${resourceId}`,
      ),
    );

    return result.data;
  }

  private async fetchTimeTables(
    resourceId: number,
    date: string,
  ): Promise<TimeTablesResult> {
    const dateWithoutHour = date;

    const result = await lastValueFrom(
      this.httpService.get(
        `${this.reservationServiceUrl}/timetables?date=${dateWithoutHour}&resourceId=${resourceId}`,
      ),
    );

    return result.data;
  }
}
