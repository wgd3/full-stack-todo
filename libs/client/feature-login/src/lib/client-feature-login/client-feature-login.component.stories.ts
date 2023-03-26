import { Meta } from '@storybook/angular';
import { ClientFeatureLoginComponent } from './client-feature-login.component';

export default {
  title: 'ClientFeatureLoginComponent',
  component: ClientFeatureLoginComponent,
} as Meta<ClientFeatureLoginComponent>;

export const Primary = {
  render: (args: ClientFeatureLoginComponent) => ({
    props: args,
  }),
  args: {},
};
