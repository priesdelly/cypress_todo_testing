import Head from 'next/head'
import React from 'react'
import TodoFormComponent from '../../components/todoForm.component'
const AddTodo = () => {
	return (
		<>
			<Head>
				<title>Add todo</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<TodoFormComponent />
		</>
	)
}

export default AddTodo