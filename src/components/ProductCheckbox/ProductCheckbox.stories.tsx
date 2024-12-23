import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Text } from '@mantine/core';
import { ProductCheckbox, type ProductCheckboxProps } from './ProductCheckbox';

const mock: ProductCheckboxProps = {
  name: 'Banana',
  showCurrency: true,
  product: { name: 'banana', category: 'fruits', quantity: 2, price: 10, unit: 'kg' },
};

//👇 This default export determines where your story goes in the story list

/**
 * Default Story: Displays the basic behavior of the ProductCheckbox component.
 *
 * Use this story to understand the default styling and interaction of the component
 * with its essential props. It provides a quick way to verify the basic functionality
 * of the component without additional customization.
 */
const meta: Meta<ProductCheckboxProps> = {
  component: ProductCheckbox,
  tags: ['autodocs'],
  args: mock,
  argTypes: {
    name: {
      description: 'The product name displayed on the button.',
    },

    showCurrency: {
      description: 'whether to display the currency.',
      control: 'boolean',
    },
    product: {
      description: 'An object with product details.',
      control: 'object',
    },

    currency: {
      description: 'The currency mode',
    },
  },
  decorators: (Story) => {
    return (
      <Stack p="lg">
        <Story />
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<ProductCheckboxProps>;

export const Default: Story = {
  args: {
    // Customize these args as needed for testing default behavior
  },
};

/**
 * Currency Modes Story: Demonstrates how the ProductCheckbox component adapts to different currency modes.
 *
 * This story showcases the flexibility of the component when using the `currency` prop.
 * It renders examples with various currency modes, including:
 * - `br` (Brazilian Real)
 * - `eua` (US Dollar)
 * - `eur` (Euro)
 * - `uk` (British Pound)
 *
 * Use this story to verify that the currency formatting works as expected for all supported modes.
 */
export const CurrencyMode: Story = {
  render: (args) => {
    return (
      <Stack>
        <Text c="dimmed" size="xs">
          br (Brazilian Real)
        </Text>
        <ProductCheckbox {...args} currency="br" />
        <Text c="dimmed" size="xs">
          eua (US Dollar)
        </Text>
        <ProductCheckbox {...args} currency="eua" />
        <Text c="dimmed" size="xs">
          eur (Euro)
        </Text>
        <ProductCheckbox {...args} currency="eur" />
        <Text c="dimmed" size="xs">
          uk (British Pound)
        </Text>
        <ProductCheckbox {...args} currency="uk" />
      </Stack>
    );
  },
};
