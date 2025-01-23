import { IconPlus } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { ActionIcon, Box, Card, Center, Drawer, Flex, Loader, rem, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Header, List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { useListItems } from '@/service/queries/list';

type Params = {
  id: string;
};

export function ListPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { id } = useParams<Params>();

  const results = useListItems(id);
  const [list, products] = results;

  const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  // Renderizando estado de carregamento
  if (list.isLoading || products.isLoading) {
    return (
      <Center flex={1} h={rem(400)}>
        <Loader />
      </Center>
    );
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
          {/* Cabeçalho e Lista */}
          <Header list={list.data} products={products.data} />
          <List list={list.data} products={products.data || []} />

          {/* Botão flutuante para abrir o gerenciador de lista no mobile */}
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

        {/* Gerenciador de lista para desktop */}
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

        {/* Gerenciador de lista em drawer no mobile */}
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
