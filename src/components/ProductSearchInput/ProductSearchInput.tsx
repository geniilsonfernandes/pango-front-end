import { IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, Loader, TextInput } from '@mantine/core';

export const ProductSearchInput = ({
  queryValue,
  setQueryValue,
  isLoading,
}: {
  queryValue: string;
  setQueryValue: (value: string) => void;
  isLoading: boolean;
}) => (
  <TextInput
    variant="filled"
    size="md"
    placeholder="Search for products"
    leftSection={isLoading ? <Loader size="xs" /> : <IconSearch size={18} />}
    rightSection={
      <ActionIcon
        style={{ opacity: queryValue ? 1 : 0 }}
        variant="light"
        size="xs"
        onClick={() => setQueryValue('')}
      >
        <IconX size={18} />
      </ActionIcon>
    }
    value={queryValue}
    onChange={(e) => setQueryValue(e.target.value)}
  />
);
