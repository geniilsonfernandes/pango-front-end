import React from 'react';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Button, ButtonVariant, Flex, ThemeIcon } from '@mantine/core';
import { Product } from '@/models/Product';

/**
 * Props for the ProductButton component.
 */
export type ProductButtonProps = {
  /**
   * The name of the product displayed on the button.
   */
  name: string;

  /**
   * Callback function triggered when adding the product.
   */
  onIncrement?: () => void;

  /**
   * Callback function triggered when removing the product.
   */
  onRemove?: () => void;

  /**
   * Callback function triggered when decrementing the product quantity.
   */
  onDecrement?: () => void;

  /**
   * An optional Product object containing product details.
   */
  product?: Product;

  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A button to manage products, with actions for adding, removing, or decrementing product quantities.
 *
 */
export const ProductButton: React.FC<ProductButtonProps> = ({
  name,
  variant = 'subtle',
  product,
  onIncrement,
  onDecrement,
  onRemove,
  onClick,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color="gray"
      justify="space-between"
      size="xs"
      leftSection={
        <ThemeIcon
          onClick={onIncrement}
          size={14}
          variant={product ? 'filled' : 'subtle'}
          color={product ? 'green' : 'gray'}
        >
          <IconPlus size={14} />
        </ThemeIcon>
      }
      rightSection={
        product?.quantity && product.quantity >= 2 ? (
          <Flex gap={8} align="center">
            <>{product?.quantity}</>

            <ActionIcon
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onDecrement?.();
              }}
            >
              <IconMinus />
            </ActionIcon>
          </Flex>
        ) : (
          <ThemeIcon
            display={product ? 'block' : 'none'}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            size={14}
            variant="subtle"
            color="red"
          >
            <IconTrash size={14} />
          </ThemeIcon>
        )
      }
      styles={{
        label: {
          width: '100%',
          textAlign: 'left',
        },
      }}
      {...props}
    >
      {name}
    </Button>
  );
};
