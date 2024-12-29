import { useMemo, useState } from 'react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { Button, Center, Group, Loader, rem, Stack, Text } from '@mantine/core';
import { useToggleShoppingItem } from '@/hooks/mutation/useToggleShoppingItem';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';
import { ListHeader } from '../ListHeader/ListHeader';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { Product } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './List.module.css';

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

  const animationsProps = {
    transition: { duration: 0.2 },
  } as HTMLMotionProps<'div'>;

  return (
    <Stack gap="xs" flex={1}>
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
        <motion.div layout className={classes.list}>
          <AnimatePresence>
            {uncheckedProducts?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
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
        </motion.div>
      </RenderIf>
      <RenderIf condition={!!checkeditems?.length}>
        <AnimatePresence>
          <motion.div className={classes.list} data-no-background layout>
            <Group p="xs" justify="space-between">
              <Text fw={500} fz="xs" c="dimmed">
                Checked Items
              </Text>
              <Button variant="outline" size="compact-xs" radius="xl">
                Clear
              </Button>
            </Group>
            {checkeditems?.map((item) => (
              <motion.div key={item.id} {...animationsProps} layout>
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
          </motion.div>
        </AnimatePresence>
      </RenderIf>
      <Product.modal
        opened={!!shoppingItem}
        shoppingItem={shoppingItem}
        onClose={() => setShoppingItem(undefined)}
        title={`${shoppingItem?.name} - ${shoppingItem?.id}`}
      />
    </Stack>
  );
};
