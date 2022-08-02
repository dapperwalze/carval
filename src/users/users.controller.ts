import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Session,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { createUserDto, updateUserDto, UserDto } from './dtos';
import { Serialize } from '../interceptors';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { User } from './user.entity';
import { Authguard } from '../guards';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('whoami')
  @UseGuards(Authguard)
  whoAmI(@GetUser() user: User) {
    return user;
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  signout(@Session() session: any) {
    session.userId = null;
  }
  @Post('signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: createUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
