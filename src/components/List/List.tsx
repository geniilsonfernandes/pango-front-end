import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Center, Group, Loader, Paper, rem, Stack, Text } from '@mantine/core';
import { useToggleShoppingItem } from '@/hooks/mutation/useToggleShoppingItem';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';
import { useListStore } from '@/store/listStore';
import { ListHeader } from '../ListHeader/ListHeader';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { FormProps, Product } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';

type ProductSelectionProps = {
  initialfocus?: FormProps['initialFocus'];
} & ShoppingItem;

export const List = () => {
  const { data, isLoading } = useShoppingList();
  const { mutate: toggleShoppingItem } = useToggleShoppingItem();
  const {
    list: { products },
    onCheckProduct,
    clearCheckedProducts,
  } = useListStore();

  const [product, setProduct] = useState<ProductSelectionProps>();

  const uncheckedProducts = useMemo(() => {
    if (!data) return [];
    return data.filter((product) => !product.checked);
  }, [data]);
  const checkeditems = useMemo(() => {
    if (!data) return [];
    return data.filter((product) => product.checked);
  }, [data]);

  return (
    <Box flex={1}>
      <ListHeader
        listName={products[0]?.category || 'No category'}
        createdAt={products[0]?.name || 'No name'}
      />
      <RenderIf
        condition={!!uncheckedProducts?.length}
        isLoading={isLoading}
        isLoadingFallback={
          <Center p="md" h={rem(200)}>
            <Loader size="sm" />
          </Center>
        }
        fallback={
          <Text fw={500} fz="xs" c="dimmed" p="md" ta="center">
            No items yet
          </Text>
        }
      >
        <Paper p="xs" component={Stack} gap="xs">
          <AnimatePresence>
            {uncheckedProducts?.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
              >
                <ProductCheckbox
                  name={item.name}
                  shoppingItem={product}
                  showCurrency
                  onClick={() => setProduct(product)}
                  onCheck={() =>
                    toggleShoppingItem({
                      id: item.name,
                      checked: true,
                    })
                  }
                  onPriceClick={() => setProduct({ ...item, initialfocus: 'quantity' })}
                  checked={item.checked}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Paper>
      </RenderIf>
      <RenderIf condition={!!checkeditems?.length}>
        <Stack pt="xs" px="sm" gap="xxs">
          <motion.div layout>
            <Group px="xs" pb="xs" justify="space-between">
              <Text fw={500} fz="xs" c="dimmed">
                Checked Items
              </Text>
              <Button
                onClick={clearCheckedProducts}
                variant="outline"
                size="compact-xs"
                radius="xl"
              >
                Clear
              </Button>
            </Group>
          </motion.div>

          {checkeditems?.map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ProductCheckbox
                name={item.name}
                shoppingItem={item}
                showCurrency
                onClick={() => setProduct(product)}
                onCheck={() =>
                  toggleShoppingItem({
                    id: item.name,
                    checked: false,
                  })
                }
                checked={item.checked}
              />
            </motion.div>
          ))}
        </Stack>
      </RenderIf>

      <Product.modal
        opened={!!product}
        initialFocus={product?.initialfocus}
        onClose={() => setProduct(undefined)}
        title="Product Details"
      />
    </Box>
  );
};
