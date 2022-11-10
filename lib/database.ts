import { DataSource } from 'typeorm';
import "reflect-metadata"
import { Todo } from '../models/todo';

const AppDataSource = new DataSource({
	type: "sqlite",
	database: "./TodoDb.sql",
	entities: [Todo],
	synchronize: true,
	logging: false,
})

export default AppDataSource;

