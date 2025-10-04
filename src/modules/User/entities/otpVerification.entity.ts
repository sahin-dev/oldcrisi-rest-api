import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
} from 'typeorm';
import { OtpStatusEnum } from '../enums/otpStatus.enum';
import { OtpTypeEnum } from '../enums/otpType.enum';
import { ObjectId } from 'mongodb';

@Entity({ name: 'otp_verification' })
export class OtpVerification {
  
  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  type: OtpTypeEnum;

  @Column()
  status: OtpStatusEnum;

  @Column()
  expiredAT: Date;

  @Column()
  code: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  setExpirationDate() {
    this.expiredAT = new Date(Date.now() + 15 * 60 * 1000);
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAT() {
    this.updatedAt = new Date();
  }
}
