import { UserEntitySchema } from '@fst/server/data-access';
import { ICreateUser, IUpdateUser, IUser } from '@fst/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureUserService {
  constructor(
    @InjectRepository(UserEntitySchema)
    private userRepository: Repository<IUser>
  ) {}

  async getOne(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  async create(user: ICreateUser): Promise<IUser> {
    const { email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
    });
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
