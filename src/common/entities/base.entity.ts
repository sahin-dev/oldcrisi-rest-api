import { BeforeInsert, BeforeUpdate, Column, ObjectId, ObjectIdColumn } from "typeorm";

export abstract class BaseEntity {

    @ObjectIdColumn()
    _id:ObjectId

    @Column()
    createdAt:Date

    @Column()
    updatedAt:Date

    @BeforeInsert()
    setCreatedAt(){
        this.createdAt = new Date(Date.now())
    }

    @BeforeInsert()
    setUpdatedAt () {
        this.updatedAt = new Date(Date.now())
    }

    @BeforeUpdate()
    updateUpdatedAt(){
        this.updatedAt = new Date(Date.now())
    }

}