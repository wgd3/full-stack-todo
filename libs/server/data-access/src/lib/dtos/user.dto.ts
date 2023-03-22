import {
  ICreateUser,
  IPublicUserData,
  ITodo,
  IUpdateUser,
} from '@fst/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
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
    example: 'Password1!',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message: `Password is not strong enough. Must contain: 8 characters, 1 number, 1 uppercase letter, 1 symbol`,
    }
  )
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

export class UpdateUserDto implements IUpdateUser {
  @ApiProperty({
    type: String,
    example: 'Password1!',
  })
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message: `Password is not strong enough. Must contain: 8 characters, 1 number, 1 uppercase letter, 1 symbol`,
    }
  )
  password!: string;

  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
  })
  @IsEmail()
  @IsOptional()
  email!: string;
}
