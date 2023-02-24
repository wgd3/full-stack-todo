import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ICreateTodo,
  ITodo,
  IUpdateTodo,
  IUpsertTodo,
} from '@fst/shared/domain';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateTodoDto implements ICreateTodo {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpsertTodoDto implements IUpsertTodo {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsBoolean()
  @IsNotEmpty()
  completed!: boolean;
}

export class UpdateTodoDto implements IUpdateTodo {
  @IsString()
  @IsOptional()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsBoolean()
  @IsOptional()
  completed!: boolean;
}
