import { IsNullable } from '@fst/server/util';
import {
  ICreateUser,
  IPublicUserData,
  ITodo,
  IUpdateUser,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_NUMBER,
  PASSWORD_MIN_SYMBOL,
  PASSWORD_MIN_UPPERCASE,
  SocialProviderEnum,
} from '@fst/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
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

  @ApiProperty({
    type: String,
    description: 'Unique identifier from an external OAuth provider',
  })
  socialId!: string | null;

  @ApiProperty({
    type: String,
    enum: SocialProviderEnum,
  })
  socialProvider!: SocialProviderEnum | null;

  @ApiProperty({
    type: String,
  })
  givenName!: string | null;

  @ApiProperty({
    type: String,
  })
  familyName!: string | null;

  @ApiProperty({
    type: String,
    description: 'URL to profile picture',
  })
  profilePicture!: string | null;
}

/**
 * This DTO decorates only the properties needed for email/password registration. This
 * allows us to expose the expected payload in Swagger docs and enforce payload structure
 * when registering via a POST call.
 *
 * Properties that are not decorated are included so that the DTO can still be used when
 * a user "registers" via a social login.
 */
export class CreateUserDto implements ICreateUser {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Password1!',
  })
  @IsStrongPassword(
    {
      minLength: PASSWORD_MIN_LENGTH,
      minNumbers: PASSWORD_MIN_NUMBER,
      minUppercase: PASSWORD_MIN_UPPERCASE,
      minSymbols: PASSWORD_MIN_SYMBOL,
    },
    {
      message: `Password is not strong enough. Must contain: ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters, 1 number, 1 uppercase letter, 1 symbol`,
    }
  )
  @MaxLength(PASSWORD_MAX_LENGTH)
  password!: string;

  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
    description: `User's last name`,
    default: null,
  })
  @IsString()
  @IsNullable()
  familyName!: string | null;

  @ApiProperty({
    type: String,
    description: `User's first name`,
    default: null,
  })
  @IsString()
  @IsNullable()
  givenName!: string | null;

  @IsUrl()
  @IsNullable()
  profilePicture!: string | null;

  @IsString()
  @IsNullable()
  socialId!: string | null;

  @IsEnum(SocialProviderEnum)
  @IsNullable()
  socialProvider!: SocialProviderEnum | null;
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
  password?: string;

  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
