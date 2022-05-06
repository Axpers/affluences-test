import { IsDateString, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ReservationQuery {
  @IsDefined()
  @IsNotEmpty()
  resourceId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsDefined()
  @IsNotEmpty()
  hour: string;
}
