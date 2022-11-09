import React from 'react'
import { ITodo } from '../interfaces/todo.interface'
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge, Button } from 'react-bootstrap';
import axios from '../lib/axios.config';
import { useRouter } from 'next/router';

const TodoComponent = (prop: { data: ITodo, index: number }) => {
	const router = useRouter();

	const onDelete = async () => {
		await axios.delete('todo/' + prop.data.id);
		router.reload();
	}

	return (
		<tr>
			<td>{prop.index}</td>
			<td>{prop.data.title}</td>
			<td>{prop.data.note}</td>
			<td>{format(new Date(prop.data.dueDate), 'MM/dd/yyyy')}</td>
			<td>{prop.data.priority}</td>
			<td>{prop.data.isFinished === true ? <Badge bg="success">Finished</Badge> : <Badge bg="danger">Todo</Badge>}</td>
			<td>
				<Link href={'todo/' + prop.data.id}><Button size="sm" variant='secondary'>Edit</Button></Link>
			</td>
			<td><Button size="sm" variant='danger' onClick={() => onDelete()}>Delete</Button></td>
		</tr>
	)
}

export default TodoComponent