import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { ListDTO, ShoppingItem } from '@/service/api';
import { useToggleShoppingItem } from '@/service/mutation/useToggleShoppingItem';
import { useListStore } from '@/store/listStore';
import { categorizeProducts } from '@/utils/categorizeShoppingItems';
import { ListHeader } from '../ListHeader/ListHeader';
import { ListStats } from '../ListStats/ListStats';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { ProductForm } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './List.module.css';

type ListProps = {
  list: ListDTO;
  products: ShoppingItem[];
};

export const List: React.FC<ListProps> = ({ list, products }) => {
  const { showPrice } = useListStore();
  const [scroll] = useWindowScroll();
  const [itemSelected, setItemSelected] = useState<ShoppingItem>();
  const { mutate: toggleShoppingItem } = useToggleShoppingItem(list.id);

  const categorizedProducts = useMemo(() => {
    return categorizeProducts(products);
  }, [products]);

  return (
    <Stack flex={1} gap={0}>
      <Stack
        gap="md"
        flex={1}
        component={Paper}
        p="sm"
        style={{
          position: 'sticky',
          top: 32,
          zIndex: 10,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottom:
            scroll.y > 0
              ? '1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
              : '',
        }}
      >
        <ListHeader list={list} />
        <AnimatePresence>
          {showPrice && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ListStats list={list} products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
      <Stack
        gap="md"
        flex={1}
        component={Paper}
        p="sm"
        style={{
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          paddingTop: 0,
        }}
      >
        <Paper>
          <AnimatePresence>
            <Paper className={classes.list} data-no-background>
              {categorizedProducts.unchecked?.map((item) => (
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
                    showPrice={showPrice}
                    onClick={() => setItemSelected(item)}
                    onCheck={() =>
                      toggleShoppingItem({
                        id: item.id,
                        checked: true,
                      })
                    }
                    onPriceClick={() => setItemSelected(item)}
                    checked={item.checked}
                  />
                </motion.div>
              ))}
            </Paper>
          </AnimatePresence>
        </Paper>
        <RenderIf condition={!!categorizedProducts.checked}>
          <Paper className={classes.list} data-no-background>
            <Group p="xs" justify="space-between">
              <Text fw={500} fz="xs" c="dimmed">
                Checked Items
              </Text>
              <Button variant="outline" size="compact-xs" radius="xl">
                Clear
              </Button>
            </Group>
            {categorizedProducts.checked?.map((item) => (
              <ProductCheckbox
                name={item.name}
                key={item.id}
                shoppingItem={item}
                showPrice={showPrice}
                onClick={() => setItemSelected(item)}
                onCheck={() =>
                  toggleShoppingItem({
                    id: item.id,
                    checked: false,
                  })
                }
                checked={item.checked}
              />
            ))}
          </Paper>
        </RenderIf>
      </Stack>

      <Modal
        opened={!!itemSelected}
        onClose={() => setItemSelected(undefined)}
        title={`${itemSelected?.name} - ${itemSelected?.id}`}
      >
        <ProductForm shoppingItem={itemSelected} onCancel={() => setItemSelected(undefined)} />
      </Modal>
    </Stack>
  );
};
