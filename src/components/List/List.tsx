import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Button, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { type List as ListType, type Product } from '@/service/models/types';
import { usePatchProduct } from '@/service/queries/product';
import { useListStore } from '@/store/listStore';
import { categorizeProducts } from '@/utils/categorizeShoppingItems';
import { ListHeader } from '../ListHeader/ListHeader';
import { ListStats } from '../ListStats/ListStats';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { ProductForm } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './List.module.css';

type ListProps = {
  list: ListType;
  products: Product[];
};

export const Header: React.FC<ListProps> = ({ list, products }) => {
  const { showPrice } = useListStore();
  const [scroll] = useWindowScroll();

  return (
    <Box
      pt="md"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'light-dark(var(--mantine-color-body), var(--mantine-color-dark-7))',
      }}
    >
      <Stack
        gap="md"
        component={Paper}
        p="sm"
        style={{
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottom:
            scroll.y > 0
              ? '1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))'
              : '',
        }}
      >
        <ListHeader list={list} products={products} />
        <AnimatePresence>
          {showPrice && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ListStats list={list} products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
};

export const List: React.FC<ListProps> = ({ products }) => {
  const { showPrice } = useListStore();
  const [productSelected, setProductSelected] = useState<Product>();

  // mutations
  const { mutate: patchProduct } = usePatchProduct();

  const categorizedProducts = useMemo(() => {
    return categorizeProducts(products);
  }, [products]);

  return (
    <>
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
              {categorizedProducts.unchecked?.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <ProductCheckbox
                    name={product.name}
                    product={product}
                    showPrice={showPrice}
                    onClick={() => setProductSelected(product)}
                    onCheck={() =>
                      patchProduct({
                        id: product.id,
                        data: {
                          checked: true,
                          list_id: product.list_id,
                        },
                      })
                    }
                    onPriceClick={() => setProductSelected(product)}
                    checked={product.checked}
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
            {categorizedProducts.checked?.map((product) => (
              <ProductCheckbox
                name={product.name}
                key={product.id}
                product={product}
                showPrice={showPrice}
                onClick={() => setProductSelected(product)}
                onCheck={() =>
                  patchProduct({
                    id: product.id,
                    data: {
                      checked: false,
                      list_id: product.list_id,
                    },
                  })
                }
                checked={product.checked}
              />
            ))}
          </Paper>
        </RenderIf>
      </Stack>
      {productSelected && (
        <Modal
          opened={!!productSelected}
          onClose={() => setProductSelected(undefined)}
          title={`${productSelected?.name}`}
        >
          <ProductForm product={productSelected} onCancel={() => setProductSelected(undefined)} />
        </Modal>
      )}
    </>
  );
};
