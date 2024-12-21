import React from 'react';
import { IconDotsVertical } from '@tabler/icons-react';
import { ActionIcon, Checkbox, CheckboxProps, Flex, Group, Text, Title } from '@mantine/core';
import classes from './ProductCheckbox.module.css';

type ProductCheckboxProps = {} & CheckboxProps;

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({ checked, opacity }) => {
  return (
    <Checkbox.Card checked={checked} opacity={opacity} className={classes.card} tabIndex={0}>
      <Flex p="sm" py="xs" align="center" justify="space-between" gap={12}>
        <Group gap="xs">
          <Checkbox.Indicator />
          <Title order={3} fz="sm" fw={500}>
            Buy milk
          </Title>
        </Group>
        <Group gap="xs">
          <Text c="gray" fz="xs">
            2L
          </Text>
          <Text c="gray" fz="xs" fw="bolder">
            $2.99
          </Text>
          <ActionIcon size={16} variant="transparent" color="gray">
            <IconDotsVertical stroke={1.5} />
          </ActionIcon>
        </Group>
      </Flex>
    </Checkbox.Card>
  );
};
