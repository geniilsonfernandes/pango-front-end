import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProductButton, type ProductButtonProps } from './ProductButton';

const mock: ProductButtonProps = {
  onRemove: fn(),
  onClick: fn(),
  onIncrement: fn(),
  onDecrement: fn(),
  name: 'Banana',
};

//👇 This default export determines where your story goes in the story list
const meta: Meta<ProductButtonProps> = {
  component: ProductButton,
  tags: ['autodocs'],
  args: mock,
  argTypes: {
    name: {
      description: 'The product name displayed on the button.',
    },
    onIncrement: {
      action: 'add',
      description: 'Callback triggered when adding the product.',
    },
    onRemove: {
      action: 'remove',
      description: 'Callback triggered when removing the product.',
    },
    onDecrement: {
      action: 'decrement',
      description: 'Callback triggered when decrementing the product quantity.',
    },
    product: {
      description: 'An object with product details.',
      control: 'object',
    },
    variant: {
      description: 'The variant of the button.',
      control: { type: 'select' },
      options: [
        'filled',
        'light',
        'outline',
        'transparent',
        'white',
        'subtle',
        'default',
        'gradient',
      ],
    },
  },
  decorators: (Story) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50 }}>
        <Story />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<ProductButtonProps>;

/**
 * This story demonstrates the default behavior of the ProductButton component.
 * When no product is selected, it displays the "add" button.
 */
export const Default: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};

/**
 * This story demonstrates the behavior when a product is already selected.
 */
export const Selected: Story = {
  args: {
    product: { name: 'banana', category: 'fruits' },
  },
};

/**
 * This story demonstrates the behavior when more than one quantity is selected.
 * It showcases the display of the decrement button and allows quantity to be incremented or decremented.
 */
export const WithDecrement: Story = {
  render: (args) => {
    const [quantity, setQuantity] = useState(2);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => prev - 1);

    return (
      <>
        <ProductButton
          variant={args.variant}
          name="Banana"
          product={{ quantity, name: 'banana', category: 'fruits' }}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </>
    );
  },
  args: {
    onDecrement: fn(),

    product: { name: 'banana', category: 'fruits', quantity: 2 },
  },
};
