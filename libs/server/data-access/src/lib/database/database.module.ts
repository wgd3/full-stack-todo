import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoEntitySchema } from './schemas/to-do.entity-schema';

@Module({
  imports: [TypeOrmModule.forFeature([ToDoEntitySchema])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
