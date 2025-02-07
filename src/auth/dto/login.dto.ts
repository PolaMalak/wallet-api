import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
