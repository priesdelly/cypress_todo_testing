
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Container, Row, Form, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { ITodo } from '../interfaces/todo.interface';
import axios from '../lib/axios.config';

const TodoFormComponent = (props: { data?: ITodo }) => {
	const router = useRouter();
	const { register, handleSubmit, formState: { errors }, setValue } = useForm();
	const now = new Date();
	const maxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
	const [error, setError] = useState<{ message: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const onSubmit = (data: any) => {
		setLoading(true);
		if (props.data) {
			axios.put('todo/' + props.data.id, data)
				.then(() => router.back())
				.catch((err) => setError(err.response.data))
				.finally(() => setLoading(false));
		} else {
			axios.post('todo', data)
				.then(() => router.back())
				.catch((err) => setError(err.response.data))
				.finally(() => setLoading(false));
		}
	};

	useEffect(() => {
		if (props.data) {
			setValue('title', props.data.title);
			setValue('note', props.data.note);
			setValue('dueDate', props.data.dueDate);
			setValue('priority', props.data.priority);
			setValue('isFinished', props.data.isFinished);
		}
	}, [])

	return (
		<Container className='d-flex justify-content-center mt-4'>
			<Row className="w-50">
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col>
							<Form.Group className="mb-3" controlId="input-title">
								<Form.Label>Title</Form.Label>
								<Form.Control type="text" maxLength={50} placeholder="Title" {...register("title")} />
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Form.Group className="mb-3" controlId="input-note">
							<Form.Label>Note</Form.Label>
							<Form.Control as="textarea" rows={3} {...register("note")} />
						</Form.Group>
					</Row>
					<Row>
						<Col>
							<Form.Group className="mb-3" controlId="input-due-date">
								<Form.Label>Due date</Form.Label>
								<Form.Control type="date" placeholder="Due date" max={maxDate.toISOString().slice(0, 10)} {...register("dueDate")} />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3" controlId="input-status">
								<Form.Label>Priority</Form.Label>
								<Form.Select {...register("priority")}>
									<option value="high">High</option>
									<option value="medium">Medium</option>
									<option value="low">Low</option>
								</Form.Select>
							</Form.Group>
						</Col>
					</Row>
					<Form.Group className="mb-3" controlId="formBasicCheckbox">
						<Form.Check {...register("isFinished")} type="checkbox" label="Finished" />
					</Form.Group>
					<Col className='d-flex justify-content-between'>
						<Button variant="primary" type="submit" disabled={loading}>
							Submit
						</Button>
						<Button variant="secondary" type="button" onClick={() => router.back()}>
							Back
						</Button>
					</Col>
					<Row className='invalid mt-3'>
						{
							error.map((err, i) => <span key={i}>{err.message}</span>)
						}
					</Row>
				</Form>
			</Row>
		</Container>
	)
}

export default TodoFormComponent