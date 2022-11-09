export interface ITodo {
	id: string;
	title: string;
	note: string;
	dueDate: string;
	priority: 'high' | 'medium' | 'low';
	isFinished: boolean;
}