import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mantine/core';
import { ListManager } from './ListManager';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ListManager> = {
  title: 'List/ListManager',
  component: ListManager,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Stack align="center" p="lg">
        <Story />
      </Stack>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListManager>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
