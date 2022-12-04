import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkApi(): string {
    return 'B3bronni launched successfully!';
  }
}
