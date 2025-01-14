import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, Group, Modal, Paper, Stack, Text } from '@mantine/core';
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
  const [itemSelected, setItemSelected] = useState<ShoppingItem>();
  const { mutate: toggleShoppingItem } = useToggleShoppingItem(list.id);
  const { showPrice } = useListStore();

  const categorizedProducts = useMemo(() => {
    return categorizeProducts(products);
  }, [products]);

  return (
    <Stack gap="md" flex={1} component={Paper} p="lg">
      <ListHeader list={list} />
      <AnimatePresence>
        {showPrice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ListStats list={list} products={products} />
          </motion.div>
        )}
      </AnimatePresence>

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
