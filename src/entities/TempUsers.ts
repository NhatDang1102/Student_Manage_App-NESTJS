import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("email", ["email"], { unique: true })
@Entity("temp_users", { schema: "studentdb" })
export class TempUsers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "email", unique: true, length: 100 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("enum", { name: "role", enum: ["student", "lecturer"] })
  role: "student" | "lecturer";

  @Column("varchar", { name: "otp_code", nullable: true, length: 6 })
  otpCode: string | null;

  @Column("timestamp", { name: "otp_expired_at", nullable: true })
  otpExpiredAt: Date | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
