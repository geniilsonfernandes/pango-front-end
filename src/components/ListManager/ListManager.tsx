import { useCallback, useState } from 'react';
import { matchSorter, rankings } from 'match-sorter';
import { Paper, ScrollArea, Stack, Tabs } from '@mantine/core';
import { useDebouncedCallback, useDebouncedValue } from '@mantine/hooks';
import { type Product } from '@/dummyData';
import { useAddShoppingItem } from '@/hooks/mutation/useAddShoppingItem';
import { useDeleteShoppingItem } from '@/hooks/mutation/useDeleteShoppingItem';
import { useUpdateShoppingItem } from '@/hooks/mutation/useUpdateShoppingItem';
import { useProducts } from '@/hooks/queries/useProducts';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { useRecentsProducts } from '@/hooks/useRecentsProducts';
import { CreateShoppingItemDTO, ShoppingItem } from '@/service/api';
import { generateNumericId } from '@/utils/generateNumericId';
import { ProductButton } from '../ProductButton/ProductButton';
import { ProductSearchInput } from '../ProductSearchInput/ProductSearchInput';

export const ListManager = () => {
  const [queryValue, setQueryValue] = useState('');
  const { mutate: addItem } = useAddShoppingItem();
  const { mutate: deleteItem } = useDeleteShoppingItem();
  const { mutate: updateItem } = useUpdateShoppingItem();
  const { addToRecents, recents } = useRecentsProducts();
  const [items, setItems] = useState<CreateShoppingItemDTO[]>([]);

  const handleAddMultipleItems = useDebouncedCallback(() => {
    items.forEach((product) => {
      addToRecents(product);
      addItem(product);
    });

    setItems([]);
  }, 800);

  const handleAddItem = (product: Product) => {
    const existingItem = items.find((item) => item.name === product.name);
    if (existingItem) {
      return;
    }
    const newProduct = {
      id: generateNumericId().toString(),
      name: product.name,
      category: product.category,
      quantity: 1,
      listId: 1,
    };
    setItems((prevItems) => [...prevItems, newProduct]);
    handleAddMultipleItems();
  };

  const handleIncrement = useCallback((item?: ShoppingItem) => {
    if (item) {
      updateItem({ id: item.id, data: { quantity: item.quantity + 1 } });
    }
  }, []);

  const handleDecrement = useCallback(
    (item?: ShoppingItem) => {
      if (item) {
        const newQuantity = item.quantity - 1;
        newQuantity === 0
          ? deleteItem(item.id)
          : updateItem({ id: item.id, data: { quantity: newQuantity } });
      }
    },
    [deleteItem, updateItem]
  );

  const handleRemoveItem = useCallback(
    (item?: ShoppingItem) => {
      if (item) {
        deleteItem(item.id);
      }
    },
    [deleteItem]
  );
  const { data: selectedList } = useShoppingList();
  const [queryDebounced] = useDebouncedValue(queryValue, 800);
  const { data: products, isLoading: isLoadingProducts } = useProducts(queryDebounced);

  const findProductInSelectedList = useCallback(
    (name: string) =>
      matchSorter(selectedList || [], name, { keys: ['name'], threshold: rankings.EQUAL })[0],
    [selectedList]
  );

  const findProductInProductList = useCallback(
    (name: string) =>
      matchSorter(products || [], name, { keys: ['name'], threshold: rankings.EQUAL })[0],
    [products]
  );

  const inputToCreateProduct = () => {
    const queryValueHasMatchInProductsSelected = findProductInSelectedList(queryValue);
    const queryValueHasMatchInProducts = findProductInProductList(queryValue);

    return (
      <>
        {!queryValueHasMatchInProducts && (
          <ProductButton
            name={queryValue}
            variant="outline"
            product={queryValueHasMatchInProductsSelected}
            onClick={() => {
              if (!queryValueHasMatchInProductsSelected) {
                handleAddItem({
                  name: queryValue,
                  category: 'other',
                });
              } else {
                handleIncrement(queryValueHasMatchInProductsSelected);
              }
            }}
            onRemove={() => handleRemoveItem(queryValueHasMatchInProductsSelected)}
            onDecrement={() => handleDecrement(queryValueHasMatchInProductsSelected)}
            onIncrement={() => handleIncrement(queryValueHasMatchInProductsSelected)}
          />
        )}
      </>
    );
  };

  const renderProducts = (list: Product[]) => {
    return (
      <>
        {list.map((product) => {
          const itemSelected = findProductInSelectedList(product.name);
          return (
            <ProductButton
              isLoading={items.some((item) => item.name === product.name)}
              key={product.name}
              name={product.name}
              product={itemSelected}
              onClick={() => {
                if (!itemSelected) {
                  handleAddItem(product);
                } else {
                  handleIncrement(itemSelected);
                }
              }}
              onRemove={() => handleRemoveItem(itemSelected)}
              onIncrement={() => handleIncrement(itemSelected)}
              onDecrement={() => handleDecrement(itemSelected)}
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
      <ProductSearchInput
        queryValue={queryValue}
        setQueryValue={setQueryValue}
        isLoading={isLoadingProducts}
      />

      {queryValue && (
        <Stack gap="xxs" mt="xs">
          <Tabs variant="pills" defaultValue="Results">
            <Tabs.List>
              <Tabs.Tab fz="sm" px="xs" py="xs" value="Results">
                Results
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Results">
              <ScrollArea h="calc(100vh - 184px)" offsetScrollbars mt="xs">
                <Stack gap="xxs">
                  {inputToCreateProduct()}
                  {renderProducts(products || [])}
                </Stack>
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
      {!queryValue && (
        <Stack gap="xxs" mt="xs">
          <Tabs variant="pills" defaultValue="Products">
            <Tabs.List>
              <Tabs.Tab fz="sm" px="xs" py="xs" value="Products">
                Products
              </Tabs.Tab>
              <Tabs.Tab fz="sm" px="xs" py="xs" value="Recents">
                Recents
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Products">
              <ScrollArea h="calc(100vh - 184px)" offsetScrollbars mt="xs">
                <Stack gap="xxs">{renderProducts(products || [])}</Stack>
              </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value="Recents">
              <ScrollArea h="calc(100vh - 184px)" offsetScrollbars mt="xs">
                <Stack gap="xxs">{renderProducts(recents || [])}</Stack>
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Paper>
  );
};
