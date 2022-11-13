import { NextApiRequest, NextApiResponse } from "next";
import AppDataSource from "../../../lib/database";
import { Todo } from "../../../models/todo";
import { af } from "date-fns/locale";

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

					if (bodyData.title && bodyData.title.length > 50) {
						errorMessage.push({ message: 'Length of title must less than 50 character.' });
					}

					if (bodyData.note && bodyData.note.length > 144) {
						errorMessage.push({ message: 'Length of note must less than 144 character.' });
					}

					if (!bodyData.dueDate) {
						errorMessage.push({ message: 'Due date is required.' });
					} else { 
						let dateObject = new Date(bodyData.dueDate);
						dateObject.setHours(0, 0, 0, 0);

						let today = new Date();
						today.setHours(0, 0, 0, 0);

						let after5Year = new Date();
						after5Year.setHours(0, 0, 0, 0);
						after5Year.setFullYear(after5Year.getFullYear() + 5); 
	
						if (dateObject < today) {
							errorMessage.push({ message: 'Due date must be after today.' }); 
						} else if (dateObject > after5Year) { 
							errorMessage.push({ message: 'Due date must not over 5 years from today.' });
						}
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