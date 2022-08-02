import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApprovedBodyDto {
  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  approved: boolean;
}
