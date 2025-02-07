import { IsNumber, Min, IsEnum, IsNotEmpty, Validate } from "class-validator";
import { ETransactionType } from "../enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsTwoDecimalPlacesConstraint } from "../decorator/two-decimals-max.decorator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Validate(IsTwoDecimalPlacesConstraint)
  @ApiProperty()
  amount: number;

  @IsEnum(ETransactionType)
  @IsNotEmpty()
  @ApiProperty({ enum: ETransactionType })
  type: ETransactionType;
}
