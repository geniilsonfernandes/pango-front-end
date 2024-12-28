import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Center, Group, Loader, Paper, rem, Stack, Text } from '@mantine/core';
import { useToggleShoppingItem } from '@/hooks/mutation/useToggleShoppingItem';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';
import { ListHeader } from '../ListHeader/ListHeader';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { Product } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';

export const List = () => {
  const { data, isLoading } = useShoppingList();
  const { mutate: toggleShoppingItem } = useToggleShoppingItem();

  const [shoppingItem, setShoppingItem] = useState<ShoppingItem>();

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
      <ListHeader listName="No category" createdAt="No name" />
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
        <Paper p="xs" component={Stack} gap="xxs">
          <AnimatePresence>
            {uncheckedProducts?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCheckbox
                  name={item.name}
                  shoppingItem={item}
                  showCurrency
                  onClick={() => setShoppingItem(item)}
                  onCheck={() =>
                    toggleShoppingItem({
                      id: item.id,
                      checked: true,
                    })
                  }
                  onPriceClick={() => setShoppingItem(item)}
                  checked={item.checked}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Paper>
      </RenderIf>
      <RenderIf condition={!!checkeditems?.length}>
        <Stack pt="xs" px="sm" gap="xxs">
          <Group px="xs" pb="xs" justify="space-between">
            <Text fw={500} fz="xs" c="dimmed">
              Checked Items
            </Text>
            <Button variant="outline" size="compact-xs" radius="xl">
              Clear
            </Button>
          </Group>
          <AnimatePresence>
            {checkeditems?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCheckbox
                  name={item.name}
                  shoppingItem={item}
                  showCurrency
                  onClick={() => setShoppingItem(item)}
                  onCheck={() =>
                    toggleShoppingItem({
                      id: item.id,
                      checked: false,
                    })
                  }
                  checked={item.checked}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      </RenderIf>

      <Product.modal
        opened={!!shoppingItem}
        shoppingItem={shoppingItem}
        onClose={() => setShoppingItem(undefined)}
        title={`${shoppingItem?.name} - ${shoppingItem?.id}`}
      />
    </Box>
  );
};
