import { UserEntitySchema } from '@fst/server/data-access';
import { ICreateUser, IUpdateUser, IUser } from '@fst/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ServerFeatureUserService {
  constructor(
    @InjectRepository(UserEntitySchema)
    private userRepository: Repository<IUser>
  ) {}

  async getOne(opts: FindOneOptions<IUser>): Promise<IUser | null> {
    return this.userRepository.findOne(opts);
  }

  async getOneOrFail(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  async getOneByEmailOrFail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  /**
   * This method is meant to be the single entry point for all user
   * creation. It was made more generic to support user creation
   * from email registration or social platforms.
   */
  async create(user: ICreateUser): Promise<IUser> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  async updateUser(id: string, data: IUpdateUser): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    const updated = await this.userRepository.save({ id, ...data });
    return updated;
  }

  async deleteUser(id: string): Promise<null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    await this.userRepository.remove(user);
    return null;
  }
}
