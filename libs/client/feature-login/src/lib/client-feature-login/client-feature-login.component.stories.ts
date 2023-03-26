import { componentWrapperDecorator, Meta } from '@storybook/angular';
import { ClientFeatureLoginComponent } from './client-feature-login.component';

export default {
  title: 'Login Component',
  component: ClientFeatureLoginComponent,
  decorators: [
    componentWrapperDecorator(
      (s) => `
      <div style="width: 50vw; height: 100vh">${s}</div>
    `
    ),
  ],
} as Meta<ClientFeatureLoginComponent>;

export const Primary = {
  render: (args: ClientFeatureLoginComponent) => ({
    props: args,
  }),
  args: {},
};
