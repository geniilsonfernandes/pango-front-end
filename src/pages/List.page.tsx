import { IconPlus } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionIcon, Box, Card, Center, Drawer, Flex, Loader, rem, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Header, List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { useListItems } from '@/service/queries/list';
import useUserStore from '@/store/userStore';
import { checkPermissions } from '@/utils/checkPermissions';

type Params = {
  id: string;
};

export function ListPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user } = useUserStore();
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  // queries
  const results = useListItems(id);
  const [list, products] = results;

  if (list.isLoading || products.isLoading) {
    return (
      <Center flex={1} h={rem(400)}>
        <Loader />
      </Center>
    );
  }

  if (!checkPermissions(list.data, user)) {
    navigate(`/`);
  }

  // Renderizando estado de erro (lista não encontrada)
  if (!list.data || !products.data) {
    return (
      <Center flex={1} h={rem(400)}>
        <Card p="md" radius="md" withBorder>
          Lista não encontrada.
        </Card>
      </Center>
    );
  }

  return (
    <>
      <Flex flex={1}>
        <Stack
          flex={1}
          gap={0}
          pb={{
            base: 100,
            md: 0,
          }}
        >
          <Header list={list.data} products={products.data} />
          <List list={list.data} products={products.data || []} />

          {isMobile && (
            <ActionIcon
              variant="filled"
              size="xl"
              onClick={openDrawer}
              style={{
                position: 'fixed',
                bottom: 70,
                right: 20,
              }}
            >
              <IconPlus size={18} />
            </ActionIcon>
          )}
        </Stack>

        {!isMobile && (
          <Box
            h="100vh"
            p="md"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <ListManager products={products.data} list={list.data} />
          </Box>
        )}

        {isMobile && (
          <Drawer.Root size="lg" opened={openedDrawer} onClose={closeDrawer} position="bottom">
            <Drawer.Overlay />
            <Drawer.Content>
              <Drawer.Body p="xs">
                <ListManager products={products.data} list={list.data} scrollSize="400px" />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )}
      </Flex>
    </>
  );
}
