import { randSentence } from '@ngneat/falso';
import axios from 'axios';

interface IDummyTodoResponse {
  todos: Array<{
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
  }>;
  total: number;
  skip: string;
  limit: number;
}

axios
  .get<IDummyTodoResponse>(`https://dummyjson.com/todos?limit=10&skip=20`)
  .then(({ data }) => {
    return data.todos.map((t) => ({
      title: t.todo,
      completed: t.completed,
      description: randSentence(),
    }));
  })
  .then(async (newTodos) => {
    for (const todo of newTodos) {
      await axios
        .post(`http://localhost:3333/api/v1/todos`, todo)
        .then((resp) => {
          console.log(resp.data);
        });
    }
  });
