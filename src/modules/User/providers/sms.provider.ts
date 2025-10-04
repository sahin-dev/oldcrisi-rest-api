import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class SmsProvider {
  abstract sendmail(to: string, subject: string, body: string): Promise<void>;
}
