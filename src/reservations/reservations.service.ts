import { TimeTablesResult } from './models/timetables.model';
import { ReservationResult } from './models/reservation.model';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class ReservationsService {
  private acceptedIds: number[] = [1337];
  private reservationServiceUrl = `http://localhost:8080`;

  constructor(private httpService: HttpService) {}

  //#region Query validations
  isDateValid(date: string): boolean {
    const isValid = moment(date, moment.ISO_8601, true).isValid();
    if (isValid) return isValid;
    else throw new BadRequestException('Date is not valid');
  }

  isHourValid(hour: String): boolean {
    const isValid = Number(hour) >= 0 && Number(hour) <= 24;
    if (isValid) return isValid;
    else throw new BadRequestException('Hour is not valid');
  }

  isIdValid(id: string): boolean {
    const isValid = this.acceptedIds.includes(Number(id));
    if (isValid) return isValid;
    else throw new BadRequestException('Id is not valid');
  }
  //#endregion

  async isAvailable(
    resourceId: string,
    date: string,
    hour: string,
  ): Promise<any> {
    try {
      if (
        this.isIdValid(resourceId) &&
        this.isDateValid(date) &&
        this.isHourValid(hour)
      ) {
        const openedSlots = await this.fetchOpenedSlots(resourceId, date);
        const timeTables = await this.fetchTimeTables(resourceId, date);

        return timeTables;

        // Compare if input date match both ressources
      }
    } catch (e) {
      throw e;
    }
  }

  //#region Microservice fetching
  private async fetchOpenedSlots(
    resourceId: string,
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
    resourceId: string,
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
  //#endregion
}
