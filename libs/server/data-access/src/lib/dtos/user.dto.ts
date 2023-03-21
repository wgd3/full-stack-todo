import { ICreateUser, IPublicUserData, ITodo } from '@fst/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { TodoDto } from './todo.dto';

export class UserResponseDto implements IPublicUserData {
  @ApiProperty({
    type: String,
    readOnly: true,
    example: 'DCA76BCC-F6CD-4211-A9F5-CD4E24381EC8',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
    readOnly: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: TodoDto,
    isArray: true,
    readOnly: true,
    example: [],
  })
  @IsArray()
  todos!: ITodo[];
}

export class CreateUserDto implements ICreateUser {
  @ApiProperty({
    type: String,
    required: true,
    example: 'something-something-darkside',
  })
  @IsStrongPassword()
  password!: string;

  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
