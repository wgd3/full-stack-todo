import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { randBoolean, randProduct } from '@ngneat/falso';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { ToDoComponent } from './to-do.component';

const randTodo = () => {
  const { id, title, description } = randProduct();
  return {
    id,
    title,
    description,
    completed: randBoolean(),
  };
};

export default {
  title: 'ToDoComponent',
  component: ToDoComponent,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
    }),
    componentWrapperDecorator(
      (s) => `
    
    <div style="width: 500px; height: 280px; position: relative; padding: 2rem">${s}</div>`
    ),
  ],
} as Meta<ToDoComponent>;

export const Primary = {
  render: (args: ToDoComponent) => ({
    props: args,
  }),
  args: {
    todo: randTodo(),
  },
};
