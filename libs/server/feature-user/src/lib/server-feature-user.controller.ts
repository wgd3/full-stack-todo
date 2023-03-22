import { CreateUserDto, UpdateUserDto } from '@fst/server/data-access';
import { ReqUserId, SkipAuth } from '@fst/server/util';
import { IPublicUserData } from '@fst/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServerFeatureUserService } from './server-feature-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatureUserController {
  private readonly logger = new Logger(ServerFeatureUserController.name);
  constructor(private serverFeatureUserService: ServerFeatureUserService) {}

  @Get(':id')
  @ApiBearerAuth()
  async getUser(
    @ReqUserId() reqUserId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<IPublicUserData> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    const { password, ...user } = await this.serverFeatureUserService.getOne(
      id
    );
    return user;
  }

  @Post('')
  @SkipAuth()
  async createUser(@Body() userData: CreateUserDto): Promise<IPublicUserData> {
    const { id, email } = await this.serverFeatureUserService.create(userData);
    return {
      id,
      email,
      todos: [],
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  async updateUser(
    @ReqUserId() reqUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDto
  ): Promise<IPublicUserData> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    const { password, ...user } =
      await this.serverFeatureUserService.updateUser(id, userData);
    return user;
  }

  @Delete('id')
  @ApiBearerAuth()
  async deleteUser(
    @ReqUserId() reqUserId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    await this.serverFeatureUserService.deleteUser(id);
  }
}
