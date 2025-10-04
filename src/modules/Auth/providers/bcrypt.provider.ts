import { Injectable } from '@nestjs/common';
import { HashingProvider } from './AbstractHashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
  public async hash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    const str = typeof data === 'string' ? data : data.toString();
    return await bcrypt.hash(str, salt);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
