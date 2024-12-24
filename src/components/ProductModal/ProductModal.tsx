import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Divider,
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
import { Product } from '@/models/Product';

type ProductModalProps = {
  product?: Product;
} & ModalProps;
export const ProductModal: React.FC<ProductModalProps> = ({
  onClose,
  opened,
  product,
  ...props
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={product?.name || ''}
      size="md"
      centered
      {...props}
    >
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
      <Group mt="lg" justify="flex-end">
        <Tooltip label="Remove">
          <ActionIcon color="red" variant="outline" size="lg" onClick={() => console.log('remove')}>
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Divider orientation="vertical" />
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button>Save</Button>
      </Group>
    </Modal>
  );
};
