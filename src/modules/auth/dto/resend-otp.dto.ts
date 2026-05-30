import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OtpType } from '@prisma/prisma/enums';

export class ResendOtpDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: OtpType, example: OtpType.EMAIL_VERIFICATION })
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}
