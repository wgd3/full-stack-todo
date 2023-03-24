import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoEntitySchema } from './schemas/to-do.entity-schema';
import { UserEntitySchema } from './schemas/user.entity-schema';

@Module({
  imports: [TypeOrmModule.forFeature([ToDoEntitySchema, UserEntitySchema])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
