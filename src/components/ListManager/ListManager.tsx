import { useCallback, useState } from 'react';
import { matchSorter, rankings } from 'match-sorter';
import { v4 as uuidv4 } from 'uuid';
import { Paper, ScrollArea, Stack, Tabs } from '@mantine/core';
import { useDebouncedCallback, useDebouncedValue } from '@mantine/hooks';
import { useRecentsProducts } from '@/hooks/useRecentsProducts';
import { ProductDTO, ShoppingItem } from '@/service/api';
import { List, Product } from '@/service/models/types';
import { useAddProduct, useDeleteProduct, usePatchProduct } from '@/service/queries/product';
import { CatalogProduct, useProductsCatalog } from '@/service/queries/useProductsCatalog';
import { ProductButton } from '../ProductButton/ProductButton';
import { ProductSearchInput } from '../ProductSearchInput/ProductSearchInput';

type ListManagerProps = {
  list: List;
  products: Product[];
};

const SIZE = 'calc(100vh - 154px)';

export const ListManager = ({ products, list }: ListManagerProps) => {
  const [queryValue, setQueryValue] = useState('');
  const [queryDebounced] = useDebouncedValue(queryValue, 800);
  const [debouncedItems, setDebouncedItems] = useState<ProductDTO[]>([]);

  // mutations
  const { mutate: patchProduct } = usePatchProduct();
  const { mutate: addItem } = useAddProduct();
  const { mutate: deleteItem } = useDeleteProduct();
  const { addToRecents, recents } = useRecentsProducts();

  // queries
  const { data: productsCatalog, isLoading: isLoadingProducts } =
    useProductsCatalog(queryDebounced);

  // handlers
  const handleAddMultipleItems = useDebouncedCallback(() => {
    debouncedItems.forEach((product) => {
      addToRecents(product);
    });
    addItem(debouncedItems);
    setDebouncedItems([]);
  }, 800);

  const handleAddProduct = (product: CatalogProduct) => {
    const existingItem = debouncedItems.find((item) => item.name === product.name);
    if (existingItem) {
      return;
    }
    const newProduct = {
      id: uuidv4(),
      name: product.name,
      category: product.category,
      quantity: 1,
      list_id: list.id,
      price: 0,
      checked: false,
    } as ProductDTO;
    setDebouncedItems((prevItems) => [...prevItems, newProduct]);
    handleAddMultipleItems();
  };

  const handleIncrement = useCallback((item?: ShoppingItem) => {
    if (item) {
      patchProduct({ id: item.id, data: { quantity: item.quantity + 1 } });
    }
  }, []);

  const handleDecrement = useCallback(
    (item?: ShoppingItem) => {
      if (item) {
        const newQuantity = item.quantity - 1;
        if (newQuantity <= 0) {
          return;
        }
        patchProduct({ id: item.id, data: { quantity: newQuantity } });
      }
    },
    [deleteItem, patchProduct]
  );

  const handleRemoveItem = useCallback(
    (item?: ShoppingItem) => {
      if (item) {
        deleteItem({
          id: item.id,
        });
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
              onRemove={() => {
                if (itemSelected) {
                  handleRemoveItem(itemSelected);
                }
              }}
              onIncrement={() => handleIncrement(itemSelected)}
              onDecrement={() => handleDecrement(itemSelected)}
            />
          );
        })}
      </>
    );
  };

  return (
    <Paper p="sm" w="100%" h="100%">
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
              <ScrollArea h={SIZE} offsetScrollbars mt="xs">
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
              <ScrollArea h={SIZE} offsetScrollbars mt="xs">
                <Stack gap="xxs">{renderProducts(productsCatalog || [])}</Stack>
              </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value="Recents">
              <ScrollArea h={SIZE} offsetScrollbars mt="xs">
                <Stack gap="xxs">{renderProducts(recents || [])}</Stack>
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Paper>
  );
};
