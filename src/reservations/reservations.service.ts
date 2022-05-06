import { TimeTablesResult } from './models/timetables.model';
import { ReservationResult } from './models/reservation.model';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReservationsService {
  private acceptedIds: number[] = [1337];
  private reservationServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    //#region Reservation service url configuration
    const reservationServiceProtocol = this.configService.get<string>(
      'RESERVATION_SERVICE_PROTOCOL',
    );

    const reservationServiceIp = this.configService.get<string>(
      'RESERVATION_SERVICE_IP',
    );

    const reservationServicePort = this.configService.get<string>(
      'RESERVATION_SERVICE_PORT',
    );
   

    this.reservationServiceUrl = `${reservationServiceProtocol}://${reservationServiceIp}:${reservationServicePort}`;
  //#endregion
  }

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
  ): Promise<boolean> {
    try {
      if (
        this.isIdValid(resourceId) &&
        this.isDateValid(date) &&
        this.isHourValid(hour)
      ) {
        const timeTables = await this.fetchTimeTables(resourceId, date);
        // Early return, not to fetch for the reservations if not open
        if (!timeTables.open) {
          return false;
        }

        const openedSlots = await this.fetchOpenedSlots(resourceId, date);

        const availableHours: number[] = this.getAvailableHours(
          openedSlots,
          timeTables,
        );

        return availableHours.includes(Number(hour));
      }
    } catch (e) {
      throw e;
    }
  }

  //#region Get available hours
  private getAvailableHours(
    reservationResult: ReservationResult,
    timeTablesResult: TimeTablesResult,
  ): number[] {
    const range = (size: number, startAt = 0): number[] => {
      return [...Array(size).keys()].map((i) => i + startAt);
    };

    const getHour = (dateTime: string): number => {
      const result = dateTime.split(' ')[1].split(':')[0];
      return Number(result);
    };

    const availableHoursArray = timeTablesResult.timetables
      .map((e) => {
        const start = getHour(e.opening);
        const end = getHour(e.closing);

        return range(end - start, start);
      })
      .reduce((acc, curr) => {
        return acc.concat(curr);
      });

    const reservedHoursArray = reservationResult.reservations
      .map((e) => {
        const start = getHour(e.reservationStart);
        const end = getHour(e.reservationEnd);

        return range(end - start, start);
      })
      .reduce((acc, curr) => {
        return acc.concat(curr);
      });

    return availableHoursArray.filter((e) => !reservedHoursArray.includes(e));
  }
  //#endregion

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
