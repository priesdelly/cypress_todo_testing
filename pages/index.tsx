import Head from 'next/head'
import { Button, Container, Row, Table } from 'react-bootstrap'
import TodoComponent from '../components/todo.component'
import { ITodo } from '../interfaces/todo.interface';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import axios from '../lib/axios.config';

export default function Home(prop: { data: ITodo[] }) {
  return (
    <>
      <Head>
        <title>Todo app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className='d-flex justify-content-center'>
        <Row className="w-75">
          <div className="d-flex justify-content-between my-4">
            <h4>Todo</h4>
            <Link href="todo/add">
              <Button data-testid="btn-add" variant="success" size='sm'>Add</Button>
            </Link>
          </div>
          <Table data-testid="table" striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Note</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                prop.data.map((x, i) => <TodoComponent key={i} index={i + 1} data={x} />)
              }
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ data: ITodo[] }> = async (context) => {
  const res = await axios.get<ITodo[]>('todo');
  const data = res.data;
  return {
    props: { data },
  }
}
