import { Column, Entity, Index, OneToMany } from "typeorm";
import { Students } from "./Students";

@Index("name", ["name"], { unique: true })
@Entity("classes", { schema: "studentdb" })
export class Classes {
  @Column("char", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "name", unique: true, length: 100 })
  name: string;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["open", "closed"],
    default: () => "'open'",
  })
  status: "open" | "closed" | null;

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

  @OneToMany(() => Students, (students) => students.class)
  students: Students[];
}
