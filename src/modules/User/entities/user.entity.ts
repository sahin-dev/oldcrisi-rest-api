import { ObjectId } from 'mongodb';
import { RolesEnum } from 'src/modules/User/enums/role.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';


@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class User {
  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: RolesEnum;

  @Column()
  fcmToken:string

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  isBlocked: boolean;

  @Column()
  isDeleted: boolean;

  constructor() {
    this.isBlocked = false;
    this.isDeleted = false;
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    if (this.isBlocked === undefined) {
      this.isBlocked = false;
    }
    if (this.isDeleted === undefined) {
      this.isDeleted = false;
    }
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
