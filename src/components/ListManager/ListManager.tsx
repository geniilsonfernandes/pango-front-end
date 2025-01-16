import { useCallback, useState } from 'react';
import { matchSorter, rankings } from 'match-sorter';
import { Paper, ScrollArea, Stack, Tabs } from '@mantine/core';
import { useDebouncedCallback, useDebouncedValue } from '@mantine/hooks';
import { useRecentsProducts } from '@/hooks/useRecentsProducts';
import { CreateShoppingItemDTO, ListDTO, ShoppingItem } from '@/service/api';
import { useAddProduct, useDeleteProduct, useUpdateProduct } from '@/service/queries/useList';
import { CatalogProduct, useProductsCatalog } from '@/service/queries/useProductsCatalog';
import { generateNumericId } from '@/utils/generateNumericId';
import { ProductButton } from '../ProductButton/ProductButton';
import { ProductSearchInput } from '../ProductSearchInput/ProductSearchInput';

type ListManagerProps = {
  list: ListDTO;
  products: ShoppingItem[];
};

export const ListManager = ({ products, list }: ListManagerProps) => {
  const [queryValue, setQueryValue] = useState('');
  const [queryDebounced] = useDebouncedValue(queryValue, 800);
  const [debouncedItems, setDebouncedItems] = useState<CreateShoppingItemDTO[]>([]);

  // mutations
  const { mutate: addItem } = useAddProduct();
  const { mutate: updateItem } = useUpdateProduct();
  const { mutate: deleteItem } = useDeleteProduct();
  const { addToRecents, recents } = useRecentsProducts();

  // queries
  const { data: productsCatalog, isLoading: isLoadingProducts } =
    useProductsCatalog(queryDebounced);

  // handlers
  const handleAddMultipleItems = useDebouncedCallback(() => {
    debouncedItems.forEach((product) => {
      addToRecents(product);
      addItem(product);
    });

    setDebouncedItems([]);
  }, 800);

  const handleAddProduct = (product: CatalogProduct) => {
    const existingItem = debouncedItems.find((item) => item.name === product.name);
    if (existingItem) {
      return;
    }
    const newProduct = {
      id: generateNumericId().toString(),
      name: product.name,
      category: product.category,
      quantity: 1,
      listId: list.id,
    };
    setDebouncedItems((prevItems) => [...prevItems, newProduct]);
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
          ? deleteItem({ id: item.id, listId: list.id })
          : updateItem({ id: item.id, data: { quantity: newQuantity } });
      }
    },
    [deleteItem, updateItem]
  );

  const handleRemoveItem = useCallback(
    (item?: ShoppingItem) => {
      if (item) {
        deleteItem({ id: item.id, listId: list.id });
      }
    },
    [deleteItem]
  );

  const findProductInSelectedList = useCallback(
    (name: string) =>
      matchSorter(products || [], name, { keys: ['name'], threshold: rankings.EQUAL })[0],
    [products]
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
                handleAddProduct({
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

  const renderProducts = (list: CatalogProduct[]) => {
    return (
      <>
        {list.map((product) => {
          const itemSelected = findProductInSelectedList(product.name);
          return (
            <ProductButton
              isLoading={debouncedItems.some((item) => item.name === product.name)}
              key={product.name}
              name={product.name}
              product={itemSelected}
              onClick={() => {
                if (!itemSelected) {
                  handleAddProduct(product);
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
      w={300}
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
                  {renderProducts(productsCatalog || [])}
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
                <Stack gap="xxs">{renderProducts(productsCatalog || [])}</Stack>
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
