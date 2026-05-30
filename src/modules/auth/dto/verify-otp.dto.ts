import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { OtpType } from '@prisma/prisma/enums';

export class VerifyOtpDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456...' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  otp: string;

  @ApiProperty({ enum: OtpType, example: OtpType.EMAIL_VERIFICATION })
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}
