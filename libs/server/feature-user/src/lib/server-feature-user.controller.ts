import { CreateUserDto } from '@fst/server/data-access';
import { IPublicUserData } from '@fst/shared/domain';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerFeatureUserService } from './server-feature-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatureUserController {
  constructor(private serverFeatureUserService: ServerFeatureUserService) {}

  @Post('')
  async createUser(@Body() userData: CreateUserDto): Promise<IPublicUserData> {
    const { id, email } = await this.serverFeatureUserService.create(userData);
    return {
      id,
      email,
      todos: [],
    };
  }
}
