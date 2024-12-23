import { useMemo, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Paper, Stack, TextInput } from '@mantine/core';
import { useDebouncedCallback, useToggle } from '@mantine/hooks';
import { products as mockProducts } from '@/dummyData';
import { Product } from '@/models/Product';
import { useListStore } from '@/store/listStore';
import { filterItems, findProductByName } from '@/utils/filterProducts';
import { ProductButton } from '../ProductButton/ProductButton';
import { RenderIf } from '../RenderIf/RenderIf';

const tabsOptions = ['Popular', 'Favorites', 'Recent'];

export const ProductManager = () => {
  const {
    addProduct,
    onRemoveProduct,
    onDecrementProduct,
    recentProducts,
    favoriteProducts,
    list: { products },
  } = useListStore();
  const [tab, toggleTab] = useToggle(tabsOptions);
  const [queryValue, setQueryValue] = useState('');

  const filteredProducts = useMemo(
    () =>
      filterItems<Product>({
        items: mockProducts,
        query: queryValue,
        keys: ['name'],
      }),
    [queryValue]
  );

  const isItemCheckboxChecked = (name: string) => findProductByName(products, name);

  const handleSearch = useDebouncedCallback((query: string) => {
    // logic to fetch data
    console.log(query);
  }, 500);

  const renderProducts = (list: Product[]) => {
    if (list.length === 0) {
      return null;
    }
    return (
      <>
        {list.map((product) => (
          <ProductButton
            name={product.name}
            product={isItemCheckboxChecked(product.name)}
            onClick={() => addProduct(product.name, product.category)}
            onRemove={() => onRemoveProduct(product.name)}
            onDecrement={() => onDecrementProduct(product.name)}
          />
        ))}
      </>
    );
  };

  return (
    <Paper p="sm" w={350} withBorder shadow="md">
      <TextInput
        variant="filled"
        size="md"
        placeholder="Search for products"
        rightSectionWidth={42}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <ActionIcon
            style={{ opacity: queryValue ? 1 : 0 }}
            variant="light"
            color="gray"
            size="xs"
            radius="xl"
            onClick={() => setQueryValue('')}
          >
            <IconX size={18} stroke={1.5} />
          </ActionIcon>
        }
        value={queryValue}
        onChange={(e) => {
          handleSearch(e.target.value);
          setQueryValue(e.target.value);
        }}
      />

      <Stack gap="xxs" mt="xs" display={queryValue ? 'flex' : 'none'}>
        <Group gap="xs" my="xs">
          <Button size="compact-xs" disabled c="dimmed" fw={600}>
            Results
          </Button>
        </Group>
        {filteredProducts.length < 4 && (
          <ProductButton
            name={queryValue}
            variant="outline"
            product={isItemCheckboxChecked(queryValue)}
            onClick={() => addProduct(queryValue, 'custom')}
            onRemove={() => onRemoveProduct(queryValue)}
            onDecrement={() => onDecrementProduct(queryValue)}
          />
        )}
        {renderProducts(filteredProducts)}
      </Stack>

      <Stack gap="xxs" mt="xs" display={queryValue ? 'none' : 'flex'}>
        <Group gap="xs" my="xs">
          {tabsOptions.map((label) => (
            <Button
              size="compact-xs"
              radius="xl"
              variant={label === tab ? 'filled' : 'outline'}
              onClick={() => toggleTab(label)}
            >
              {label}
            </Button>
          ))}
        </Group>
        <RenderIf condition={tab === tabsOptions[0]}>{renderProducts(mockProducts)}</RenderIf>
        <RenderIf condition={tab === tabsOptions[1]}>{renderProducts(favoriteProducts)}</RenderIf>
        <RenderIf condition={tab === tabsOptions[2]}>{renderProducts(recentProducts)}</RenderIf>
      </Stack>
    </Paper>
  );
};
