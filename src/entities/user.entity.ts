import { Entity, Column, Index, BeforeInsert } from "typeorm";
import Model from "./model.entity";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  @Column({
    default: "default.png",
  })
  photo: string;

  @Column({
    default: false,
  })
  enable: boolean;

  @Column({
    default: false,
  })
  verify: boolean;

  @Column({
    default: false,
  })
  subcribe: boolean;

  @Index("verificationCode_index")
  @Column({
    type: "text",
    nullable: true,
  })
  verificationCode!: string | null;

  @BeforeInsert()
  async hashedPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString("hex");

    const hashedVerificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    return { verificationCode, hashedVerificationCode };
  }
}
