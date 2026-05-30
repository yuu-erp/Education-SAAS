import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './core/mail.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

export class TestMailDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // NOTE: This is a public test endpoint.
  // Should be protected or removed in production.
  @Post('test')
  @ApiOperation({ summary: 'Test sending a Verify Email template' })
  @HttpCode(HttpStatus.OK)
  async testMail(@Body() body: TestMailDto) {
    const templatePath = path.join(
      process.cwd(),
      'src/integrations/mail/templates/auth/verify-email.template.html',
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace variables
    const variables = {
      firstName: 'Test User',
      verifyLink: 'https://example.com/verify?token=test-token-123',
      organizationName: 'Our Platform',
    };

    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    await this.mailService.sendMail({
      to: body.email,
      subject: 'Welcome! Please verify your email',
      html,
    });

    return { message: `Test email sent successfully to ${body.email}!` };
  }
}
