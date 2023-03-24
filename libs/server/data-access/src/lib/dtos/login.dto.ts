import { ILoginPayload, ITokenResponse } from '@fst/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto implements ILoginPayload {
  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Password1!',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class LoginResponseDto implements ITokenResponse {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  @IsString()
  access_token!: string;
}
