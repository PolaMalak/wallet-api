import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class ChargeDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @ApiProperty()
  amount: number;
}
