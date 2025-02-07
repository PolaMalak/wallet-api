import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEmail()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  @MinLength(8)
  password: string;
}
