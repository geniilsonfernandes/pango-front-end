import { useMemo, useState } from 'react';
import { Button, Center, Group, Loader, Modal, Paper, rem, Stack, Text } from '@mantine/core';
import { useToggleShoppingItem } from '@/hooks/mutation/useToggleShoppingItem';
import { useShoppingList } from '@/hooks/queries/useShoppingList';
import { ShoppingItem } from '@/service/api';
import { ListHeader, useListHeaderStore } from '../ListHeader/ListHeader';
import { ProductCheckbox } from '../ProductCheckbox/ProductCheckbox';
import { ProductForm } from '../ProductForm/ProductForm';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './List.module.css';

export const List = () => {
  const { showPrice } = useListHeaderStore();
  const { data, isLoading } = useShoppingList();

  const { mutate: toggleShoppingItem } = useToggleShoppingItem();

  const [shoppingItem, setShoppingItem] = useState<ShoppingItem>();

  const uncheckedProducts = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((product) => !product.checked);
  }, [data]);
  const checkeditems = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((product) => product.checked);
  }, [data]);

  return (
    <Stack gap="xs" flex={1}>
      <ListHeader listName="No category" createdAt="No name" data={data} />
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
        <Paper className={classes.list}>
          {uncheckedProducts?.map((item) => (
            <ProductCheckbox
              name={item.name}
              shoppingItem={item}
              key={item.id}
              showPrice={showPrice}
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
          ))}
        </Paper>
      </RenderIf>
      <RenderIf condition={!!checkeditems?.length}>
        <Paper className={classes.list} data-no-background>
          <Group p="xs" justify="space-between">
            <Text fw={500} fz="xs" c="dimmed">
              Checked Items
            </Text>
            <Button variant="outline" size="compact-xs" radius="xl">
              Clear
            </Button>
          </Group>

          {checkeditems?.map((item) => (
            <ProductCheckbox
              name={item.name}
              key={item.id}
              shoppingItem={item}
              showPrice={showPrice}
              onClick={() => setShoppingItem(item)}
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
        opened={!!shoppingItem}
        onClose={() => setShoppingItem(undefined)}
        title={`${shoppingItem?.name} - ${shoppingItem?.id}`}
      >
        <ProductForm shoppingItem={shoppingItem} onCancel={() => setShoppingItem(undefined)} />
      </Modal>
    </Stack>
  );
};
