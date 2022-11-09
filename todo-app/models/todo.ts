import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string

	@Column()
	note: string;

	@Column()
	dueDate: string;

	@Column()
	priority: string;

	@Column()
	isFinished: boolean;
}