import { ApiProperty } from '@nestjs/swagger';

export class TestDTO {
  @ApiProperty()
  message: string;
}
