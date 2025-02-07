import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { UserResponse } from "./response";
import { GetLoggedUserId } from "src/auth/decorator";

@Controller("users")
@ApiTags("Users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    example: "User with id 1 was not found",
  })
  getUserProfile(@GetLoggedUserId() userId: number) {
    return this.userService.getUserProfile(userId);
  }
}
