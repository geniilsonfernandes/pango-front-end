import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Center, Group, Loader, Paper, rem, Stack, Text } from '@mantine/core';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { Product as ProductType } from '@/models/Product';
import { useListStore } from '@/store/listStore';
import { ListHeader } from '../ListHeader/ListHeader';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { FormProps, Product } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';

type ProductSelectionProps = {
  initialfocus?: FormProps['initialFocus'];
} & ProductType;

export const List = () => {
  const { data, isLoading } = useShoppingList();
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
  const checkedProducts = useMemo(() => {
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
            {uncheckedProducts?.map((product) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
              >
                <ProductCheckbox
                  name={product.name}
                  product={product}
                  showCurrency
                  onClick={() => setProduct(product)}
                  onCheck={() => onCheckProduct(product.name)}
                  onPriceClick={() => setProduct({ ...product, initialfocus: 'quantity' })}
                  checked={product.checked}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Paper>
      </RenderIf>
      <RenderIf condition={!!checkedProducts?.length}>
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

          {checkedProducts?.map((product) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ProductCheckbox
                name={product.name}
                product={product}
                showCurrency
                onClick={() => setProduct(product)}
                onCheck={() => onCheckProduct(product.name)}
                checked={product.checked}
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
