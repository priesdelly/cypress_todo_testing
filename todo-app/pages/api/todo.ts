import type { NextApiRequest, NextApiResponse } from 'next'
import AppDataSource from '../../lib/database';
import "reflect-metadata"
import { Todo } from '../../models/todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}

	const { method } = req;

	switch (method) {
		case 'GET':
			const data = await AppDataSource.getRepository(Todo).find();
			res.status(200).json(data);
			break;
		case 'POST':
			const bodyData = req.body as Todo;
			const errorMessage: { message: string }[] = [];
			if (!bodyData.title) {
				errorMessage.push({ message: 'Title is required.' });
			}
			if (!bodyData.dueDate) {
				errorMessage.push({ message: 'Due date is required.' });
			}
			if (!bodyData.priority) {
				errorMessage.push({ message: 'Priority is required.' });
			}
			if (errorMessage.length > 0) {
				res.status(400).json(errorMessage);
				break;
			}
			const newTodo = {
				title: bodyData.title,
				note: bodyData.note,
				dueDate: bodyData.dueDate,
				priority: bodyData.priority,
				isFinished: bodyData.isFinished,
			}
			const todo = await AppDataSource.getRepository(Todo).create(newTodo);
			const result = await AppDataSource.getRepository(Todo).save(todo);
			res.status(201).json(result);
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}