import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ICreateTodo,
  ITodo,
  IUpdateTodo,
  IUpsertTodo,
} from '@fst/shared/domain';

/**
 * This DTO was added so that a class can be used as a return type in the
 * Swagger documentation. All properties are marked `readOnly` in the
 * ApiProperty decorator since this DTO will only be used for responses.
 *
 * @export
 * @class TodoDto
 * @typedef {TodoDto}
 * @implements {ITodo}
 */
export class TodoDto implements ITodo {
  @ApiProperty({
    type: String,
    example: `Create a new blog post`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: String,
    example: `The Full Stack Engineer blog needs a new post!`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    type: String,
    readOnly: true,
    example: 'DCA76BCC-F6CD-4211-A9F5-CD4E24381EC8',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    type: Boolean,
    readOnly: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  completed!: boolean;
}

export class CreateTodoDto implements ICreateTodo {
  @ApiProperty({
    type: String,
    example: `Create a new blog post`,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: String,
    example: `The Full Stack Engineer blog needs a new post!`,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpsertTodoDto implements IUpsertTodo {
  @ApiProperty({
    type: String,
    example: `Create a new blog post`,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: String,
    example: `The Full Stack Engineer blog needs a new post!`,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  completed!: boolean;
}

export class UpdateTodoDto implements IUpdateTodo {
  @ApiProperty({
    type: String,
    example: `The Full Stack Engineer blog needs a new post!`,
    required: false,
  })
  @IsString()
  @IsOptional()
  title!: string;

  @ApiProperty({
    type: String,
    example: `The Full Stack Engineer blog needs a new post!`,
    required: false,
  })
  @IsString()
  @IsOptional()
  description!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed!: boolean;
}
