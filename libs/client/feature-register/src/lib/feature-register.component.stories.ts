import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { FeatureRegisterComponent } from './feature-register.component';

export default {
  title: 'FeatureRegisterComponent',
  component: FeatureRegisterComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
    }),
    componentWrapperDecorator(
      (s) => `
      <div style="width: 50vw; height: 100vh">${s}</div>
    `
    ),
  ],
} as Meta<FeatureRegisterComponent>;

export const Primary = {
  render: (args: FeatureRegisterComponent) => ({
    props: args,
  }),
  args: {},
};
