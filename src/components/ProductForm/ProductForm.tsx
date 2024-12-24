import React from 'react';
import { IconTrash } from '@tabler/icons-react';
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
import { categories } from '@/dummyData';
import { Product as ProductType } from '@/models/Product';

// type ProductModalProps<T> = {
//   component?: ComponentType<T>;
//   initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
// } & T;

// const Ex = <T extends object>({ component, initialFocus, ...props }: ProductModalProps<T>) => {
//   const ComponentToRender = component || React.Fragment;
//   return <ComponentToRender {...(props as T)} />;
// };

export type FormProps = {
  product?: ProductType;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
  onCancel?: () => void;
};

const Form: React.FC<FormProps> = ({ onCancel }) => {
  return (
    <>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <TextInput label="Name" placeholder="ex: Rice" />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            label="Category"
            placeholder="Pick category"
            data={categories.map((item) => ({ label: item.name, value: item.name }))}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Quantity" placeholder="ex: 2" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Unit" placeholder="ex: kg" />
        </Grid.Col>
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
          <Button>Save</Button>
        </Group>
      </Group>
    </>
  );
};

const Root = () => {
  return <Form />;
};

type ModalFormProps = {
  product?: ProductType;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
} & ModalProps;
const ModalForm: React.FC<ModalFormProps> = (props) => {
  return (
    <Modal {...props}>
      <Form
        initialFocus={props.initialFocus}
        product={props.product}
        onCancel={() => {
          props.onClose?.();
        }}
      />
    </Modal>
  );
};

type DrawerFormProps = {
  product?: ProductType;
  initialFocus?: 'name' | 'category' | 'quantity' | 'unit';
} & DrawerProps;
const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  return (
    <Drawer {...props}>
      <Form
        initialFocus={props.initialFocus}
        product={props.product}
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
