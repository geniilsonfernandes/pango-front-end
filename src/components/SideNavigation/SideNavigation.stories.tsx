import type { Meta, StoryObj } from '@storybook/react';
import { SideNavigation, type SideNavigationProps } from './SideNavigation';

//👇 This default export determines where your story goes in the story list
const meta: Meta<SideNavigationProps> = {
  component: SideNavigation,
  argTypes: {
    initialValue: {
      control: { type: 'number' }, // Define um controle numérico
      description: 'Valor inicial do contador',
      defaultValue: 0,
    },
    step: {
      control: { type: 'number' }, // Define outro controle numérico
      description: 'Passo do contador',
      defaultValue: 1,
    },
  },
};

export default meta;
type Story = StoryObj<SideNavigationProps>;

export const FirstStory: Story = {
  args: {
    initialValue: 32424,
    step: 1,
  },
};
