import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Classes } from "./Classes";

@Index("class_id", ["classId"], {})
@Index("student_code", ["studentCode"], { unique: true })
@Index("user_id", ["userId"], {})
@Entity("students", { schema: "studentdb" })
export class Students {
  @Column("char", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "student_code", unique: true, length: 50 })
  studentCode: string;

  @Column("char", { name: "user_id", length: 36 })
  userId: string;

  @Column("char", { name: "class_id", nullable: true, length: 36 })
  classId: string | null;

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

  @ManyToOne(() => Users, (users) => users.students, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Classes, (classes) => classes.students, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "class_id", referencedColumnName: "id" }])
  class: Classes;
}
