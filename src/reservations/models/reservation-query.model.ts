import { IsDateString, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ReservationQuery {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  resourceId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  hour: string;
}
