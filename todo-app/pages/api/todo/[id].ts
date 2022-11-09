import { NextApiRequest, NextApiResponse } from "next";
import AppDataSource from "../../../lib/database";
import { Todo } from "../../../models/todo";

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}

	const { query: { id }, method } = req;

	switch (method) {
		case 'GET':
			try {
				const data = await AppDataSource.getRepository(Todo).findOneBy({ id: Number(id) });
				if (data) {
					res.status(200).json(data);
				} else {
					res.status(404).json({ message: 'Data not found.' });
				}
			} catch (err: any) {
				res.status(400).json({ message: err.message });
			}
			break
		case 'PUT':
			try {
				const data = await AppDataSource.getRepository(Todo).findOneBy({ id: Number(id) });
				if (data) {
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
					const updatedTodo = {
						title: bodyData.title,
						note: bodyData.note,
						dueDate: bodyData.dueDate,
						priority: bodyData.priority,
						isFinished: bodyData.isFinished,
					}
					const todo = AppDataSource.getRepository(Todo).merge(data, updatedTodo);
					const result = AppDataSource.getRepository(Todo).save(todo);
					res.status(200).json(result);
				} else {
					res.status(404).json({ message: 'Data not found.' });
				}
			} catch (err: any) {
				res.status(400).json({ message: err.message });
			}
			break;
		case 'DELETE':
			try {
				const data = await AppDataSource.getRepository(Todo).findOneBy({ id: Number(id) });
				if (data) {
					const result = AppDataSource.getRepository(Todo).delete(data.id);
					res.status(200).json(result);
				} else {
					res.status(404).json({ message: 'Data not found.' });
				}
			} catch (err: any) {
				res.status(400).json({ message: err.message });
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}