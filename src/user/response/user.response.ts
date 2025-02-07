import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  joinedAt: string;
  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.joinedAt = new Date(user.createdAt).toDateString();
  }
}
