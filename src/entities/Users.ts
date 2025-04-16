import { Column, Entity, Index, OneToMany } from "typeorm";
import { Students } from "./Students";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "studentdb" })
export class Users {
  @Column("char", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "email", unique: true, length: 100 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("enum", { name: "role", enum: ["student", "lecturer"] })
  role: "student" | "lecturer";

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(() => Students, (students) => students.user)
  students: Students[];
}
