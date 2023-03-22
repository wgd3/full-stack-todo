import { CreateUserDto, UpdateUserDto } from '@fst/server/data-access';
import { IPublicUserData } from '@fst/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerFeatureUserService } from './server-feature-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatureUserController {
  constructor(private serverFeatureUserService: ServerFeatureUserService) {}

  @Get('id')
  async getUser(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IPublicUserData> {
    const { password, ...user } = await this.serverFeatureUserService.getOne(
      id
    );
    return user;
  }

  @Post('')
  async createUser(@Body() userData: CreateUserDto): Promise<IPublicUserData> {
    const { id, email } = await this.serverFeatureUserService.create(userData);
    return {
      id,
      email,
      todos: [],
    };
  }

  @Patch('id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDto
  ): Promise<IPublicUserData> {
    const { password, ...user } =
      await this.serverFeatureUserService.updateUser(id, userData);
    return user;
  }

  @Delete('id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.serverFeatureUserService.deleteUser(id);
  }
}
