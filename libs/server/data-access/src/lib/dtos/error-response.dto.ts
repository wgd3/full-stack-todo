import { IApiErrorResponse } from '@fst/shared/domain';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto implements IApiErrorResponse {
  @ApiProperty({
    type: String,
  })
  message!: string;

  @ApiProperty({
    type: String,
  })
  error!: string;
}
