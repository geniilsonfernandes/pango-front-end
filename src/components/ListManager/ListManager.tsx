import { useMemo, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Paper, ScrollArea, Stack, TextInput } from '@mantine/core';
import { useDebouncedCallback, useToggle } from '@mantine/hooks';
import { products as mockProducts, type Product } from '@/dummyData';
import { useAddShoppingItem } from '@/hooks/mutation/useAddShoppingItem';
import { useDeleteShoppingItem } from '@/hooks/mutation/useDeleteShoppingItem';
import { useUpdateShoppingItem } from '@/hooks/mutation/useUpdateShoppingItem';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';
import { filterItems, findProductByName } from '@/utils/filterProducts';
import { generateNumericId } from '@/utils/generateNumericId';
import { ProductButton } from '../ProductButton/ProductButton';
import { RenderIf } from '../RenderIf/RenderIf';

const tabsOptions = ['Popular', 'Favorites', 'Recent'];

export const ListManager = () => {
  const { mutate: addItem } = useAddShoppingItem();
  const { mutate: deleteItem } = useDeleteShoppingItem();
  const { mutate: updateItem } = useUpdateShoppingItem();
  const { data: products } = useShoppingList();

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

  const showInputToCreateProduct = useMemo(() => {
    return (
      !filteredProducts.some(
        (product) => product.name.toLowerCase() === queryValue.toLowerCase()
      ) && queryValue
    );
  }, [queryValue, filteredProducts]);

  const isItemSelected = (name: string) => findProductByName(products || [], name);
  const queryValueHasMatchInProducts = isItemSelected(queryValue);

  const handleSearch = useDebouncedCallback((query: string) => {
    console.log(query);
  }, 500);

  const handleAddItem = useDebouncedCallback((product: Product) => {
    addItem({
      id: generateNumericId().toString(),
      name: product.name,
      category: product.category,
      quantity: 1,
      listId: 1,
    });
  }, 500);

  const itemIncrement = (item?: ShoppingItem) => {
    if (!item) {
      return;
    }
    const quantity = item.quantity + 1;

    updateItem({ id: item.id, data: { quantity } });
  };

  const itemDecrement = (item?: ShoppingItem) => {
    if (!item) {
      return;
    }
    const quantity = item.quantity - 1;

    if (quantity === 0) {
      deleteItem(item.id);
      return;
    }

    updateItem({ id: item.id, data: { quantity } });
  };

  const handleRemoveItem = (item?: ShoppingItem) => {
    if (!item) {
      return;
    }
    deleteItem(item.id);
  };

  const renderProducts = (list: Product[]) => {
    if (list.length === 0) {
      return null;
    }

    return (
      <>
        {list.map((product) => {
          const itemSelected = isItemSelected(product.name);
          return (
            <ProductButton
              key={product.name}
              name={product.name}
              product={itemSelected}
              onClick={() => {
                if (!itemSelected) {
                  handleAddItem(product);
                }
              }}
              onRemove={() => handleRemoveItem(itemSelected)}
              onIncrement={() => itemIncrement(itemSelected)}
              onDecrement={() => itemDecrement(itemSelected)}
            />
          );
        })}
      </>
    );
  };

  return (
    <Paper
      p="sm"
      w={350}
      h="calc(100vh - 64px)"
      style={{
        position: 'sticky',
        top: 32,
      }}
    >
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

      <Stack gap="xs" mt="sm">
        <Group gap="xs">
          {tabsOptions.map((label) => (
            <Button
              key={label}
              size="compact-xs"
              radius="xl"
              variant={label === tab ? 'filled' : 'outline'}
              onClick={() => toggleTab(label)}
            >
              {label}
            </Button>
          ))}
        </Group>
        <RenderIf condition={tab === tabsOptions[0]}>
          <ScrollArea
            h="calc(100vh - 184px)"
            offsetScrollbars
            scrollbarSize={8}
            scrollHideDelay={500}
          >
            {showInputToCreateProduct && (
              <ProductButton
                name={queryValue}
                variant="outline"
                product={queryValueHasMatchInProducts}
                onClick={() => handleAddItem({ name: queryValue, category: 'Custom' })}
                onRemove={() => handleRemoveItem(queryValueHasMatchInProducts)}
                onDecrement={() => itemDecrement(queryValueHasMatchInProducts)}
                onIncrement={() => itemIncrement(queryValueHasMatchInProducts)}
              />
            )}
            {renderProducts(filteredProducts)}
          </ScrollArea>
        </RenderIf>
      </Stack>
    </Paper>
  );
};
