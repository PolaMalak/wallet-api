import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[0-9]/, { message: "Password must contain at least one number" })
  @ApiProperty()
  password: string;
}
