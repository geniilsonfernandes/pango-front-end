import React, { useCallback } from 'react';
import { IconTrash } from '@tabler/icons-react';
import * as z from 'zod';
import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  NumberInput,
  Select,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
// import { useForm } from 'react-hook-form';
import { categories } from '@/dummyData';
import { ShoppingItem } from '@/service/api';
import { useDeleteProduct, useUpdateProduct } from '@/service/queries/list';

// import { useForm } from 'react-hook-form';

// type ProductModalProps<T> = {
//   component?: ComponentType<T>;
//   initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
// } & T;

// const Ex = <T extends object>({ component, initialFocus, ...props }: ProductModalProps<T>) => {
//   const ComponentToRender = component || React.Fragment;
//   return <ComponentToRender {...(props as T)} />;
// };

export type FormProps = {
  product?: ShoppingItem;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
  onCancel?: () => void;
};

const shoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string(),
  quantity: z.number(),
  price: z.number().optional(),
  unit: z.string().optional(),
});

export const ProductForm: React.FC<FormProps> = ({ onCancel, product }) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: product?.name || '',
      category: product?.category || '',
      quantity: product?.quantity || 0,
      unit: product?.unit || '',
      price: product?.price || 0,
    },
    validate: zodResolver(shoppingItemSchema),
  });

  // mutations
  const { mutate: updateProduct, isLoading } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  // Handlers
  const handleUpdate = (values: typeof form.values) => {
    if (!product?.id) {
      notifications.show({
        title: 'Error',
        message: 'Item not found',
        color: 'red',
      });
      return;
    }
    updateProduct(
      {
        id: product?.id,
        data: {
          ...values,
          listId: product?.listId,
        },
      },
      {
        onSuccess: () => {
          onCancel?.();
        },
      }
    );
  };

  const handleDeleteProduct = useCallback((item?: ShoppingItem) => {
    if (item) {
      deleteProduct(
        {
          id: item.id,
          listId: item.listId || '',
        },
        {
          onSuccess: () => {
            onCancel?.();
          },
        }
      );
    }
  }, []);

  return (
    <form onSubmit={form.onSubmit(handleUpdate)}>
      <Grid gutter="sm">
        {product?.listId}
        <Grid.Col span={12}>
          <TextInput
            label="Name"
            placeholder="ex: Rice"
            {...form.getInputProps('name')}
            error={form.errors.name}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            label="Category"
            placeholder="Pick category"
            {...form.getInputProps('category')}
            error={form.errors.category}
            data={categories.map((item) => ({ label: item.name, value: item.name }))}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <NumberInput
            label="Quantity"
            placeholder="ex: 2"
            {...form.getInputProps('quantity')}
            error={form.errors.quantity}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Unit"
            placeholder="ex: kg"
            {...form.getInputProps('unit')}
            error={form.errors.unit}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Price"
            prefix="R$ "
            thousandSeparator=","
            defaultValue={1_000_000}
            {...form.getInputProps('price')}
            error={form.errors.price}
          />
        </Grid.Col>
        {/* <Grid.Col span={4}>
          <NumberInput
            label="Total"
            prefix="R$ "
            thousandSeparator=","
            defaultValue={1_000_000}
            {...form.getInputProps('price')}
            error={form.errors.price}
            disabled
          />
        </Grid.Col> */}
      </Grid>
      <Divider my="md" />
      <Group mt="lg" justify="space-between">
        <Tooltip label="Remove">
          <ActionIcon
            color="red"
            variant="outline"
            size="lg"
            onClick={() => handleDeleteProduct(product)}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Group gap="xs">
          <Button variant="outline" color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </Group>
      </Group>
    </form>
  );
};
