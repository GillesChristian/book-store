import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: string;
  message: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthStatus {
    return { status: 'ok', message: 'Service is running' };
  }
}
