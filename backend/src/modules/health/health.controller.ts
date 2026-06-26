import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  check() {
    return {
      data: { status: 'ok', uptime: process.uptime() },
      message: 'Service is healthy',
    };
  }
}
