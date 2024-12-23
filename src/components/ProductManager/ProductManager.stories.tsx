import type { Meta, StoryObj } from '@storybook/react';
import { ProductManager } from './ProductManager';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ProductManager> = {
  component: ProductManager,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductManager>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
