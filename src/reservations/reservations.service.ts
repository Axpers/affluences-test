import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class ReservationsService {
  private acceptedIds: number[] = [1337];
  private reservationServiceUrl = `http://localhost:8080`;

  constructor(private httpService: HttpService) {}

  isValidDate(date: any) {
    return date instanceof Date;
  }

  async isAvailable(
    inputResourceId: string,
    inputDate: string,
  ): Promise<boolean> {
    const resourceId = Number(inputResourceId);
    const date = new Date(inputDate);

    // Check if date and ressource are valid, and if it has an hour
    if (this.acceptedIds.includes(resourceId) && this.isValidDate(date)) {
      let openedSlots;
      (await this.fetchOpenedSlots(resourceId, date)).subscribe(
        (value) => (openedSlots = value),
      );

      let timeTables;
      (await this.fetchTimeTables(resourceId, date)).subscribe(
        (value) => (timeTables = value),
      );

      return openedSlots && timeTables;

      // Compare if input date match both ressources
    } else {
      throw new BadRequestException('Id or date are invalid');
    }
  }

  private async fetchOpenedSlots(
    resourceId: number,
    date: Date,
  ): Promise<Observable<AxiosResponse<any>>> {
    const dateWithoutHour = date;

    return this.httpService.get(
      `${this.reservationServiceUrl}/reservations?date=${dateWithoutHour}&resourceId=${resourceId}`,
    );
  }

  private async fetchTimeTables(
    resourceId: number,
    date: Date,
  ): Promise<Observable<AxiosResponse<any>>> {
    const dateWithoutHour = date;

    return this.httpService.get(
      `${this.reservationServiceUrl}/timetables?date=${dateWithoutHour}&resourceId=${resourceId}`,
    );
  }
}
