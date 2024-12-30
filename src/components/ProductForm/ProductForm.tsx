import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import * as z from 'zod';
import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Grid,
  Group,
  Modal,
  ModalProps,
  NumberInput,
  Select,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
// import { useForm } from 'react-hook-form';
import { categories } from '@/dummyData';
import { useUpdateShoppingItem } from '@/hooks/mutation/useUpdateShoppingItem';
import { ShoppingItem } from '@/service/api';

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
  shoppingItem?: ShoppingItem;
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

const Form: React.FC<FormProps> = ({ onCancel, shoppingItem }) => {
  const { mutate: updateItem, status, isLoading } = useUpdateShoppingItem();

  const form = useForm({
    mode: 'uncontrolled',

    initialValues: {
      name: shoppingItem?.name || '',
      category: shoppingItem?.category || '',
      quantity: shoppingItem?.quantity || 0,
      unit: shoppingItem?.unit || '',
      price: shoppingItem?.price || 0,
    },
    validate: zodResolver(shoppingItemSchema),
  });

  const handleUpdate = (values: typeof form.values) => {
    if (!shoppingItem?.id) {
      notifications.show({
        title: 'Error',
        message: 'Item not found',
        color: 'red',
      });
      return;
    }
    updateItem({
      id: shoppingItem?.id,
      data: values,
    });

    notifications.show({
      title: 'Success',
      message: 'Item updated',
      color: 'green',
    });

    onCancel?.();
  };

  return (
    <form onSubmit={form.onSubmit(handleUpdate)}>
      <Grid gutter="sm">
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
          <ActionIcon color="red" variant="outline" size="lg" onClick={() => console.log('remove')}>
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

const Root = ({ shoppingItem }: { shoppingItem?: ShoppingItem }) => {
  return <Form shoppingItem={shoppingItem} />;
};

type ModalFormProps = {
  shoppingItem?: ShoppingItem;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
} & ModalProps;
const ModalForm: React.FC<ModalFormProps> = ({ shoppingItem, ...props }) => {
  return (
    <Modal {...props}>
      <Form
        initialFocus={props.initialFocus}
        shoppingItem={shoppingItem}
        onCancel={() => {
          props.onClose?.();
        }}
      />
    </Modal>
  );
};

type DrawerFormProps = {
  shoppingItem?: ShoppingItem;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
} & DrawerProps;
const DrawerForm: React.FC<DrawerFormProps> = ({ shoppingItem, ...props }) => {
  return (
    <Drawer {...props}>
      <Form
        initialFocus={props.initialFocus}
        shoppingItem={shoppingItem}
        onCancel={() => {
          props.onClose?.();
        }}
      />
    </Drawer>
  );
};

Root.modal = ModalForm;
Root.drawer = DrawerForm;

export const Product = Root;
