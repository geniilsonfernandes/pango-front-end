import { IconPlus, IconShare } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Drawer,
  Flex,
  Loader,
  Modal,
  rem,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Header, List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { useListItems, useShareList } from '@/service/queries/list';
import useUserStore from '@/store/userStore';

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

  // mutations
  const { mutate: share, isLoading: isSharing } = useShareList();

  // handles

  const handleAccpetShare = () => {
    if (!id) {
      return;
    }
    share(id, {
      onSuccess: () => {
        list.refetch();
        products.refetch();
      },
    });
  };

  const checkPermissions = () => {
    const isOwner = list.data?.owner?.id === user?.id;

    if (isOwner) {
      return true;
    }
    const sharedUser = list.data?.shared_with.find(
      (sharedUser) => sharedUser?.user?.id === user?.id
    );

    return sharedUser;
  };

  // Renderizando estado de carregamento
  if (list.isLoading || products.isLoading) {
    return (
      <Center flex={1} h={rem(400)}>
        <Loader />
      </Center>
    );
  }

  if (!checkPermissions()) {
    const { name } = list?.data?.owner ?? { name: 'Unknown' };

    return (
      <Modal opened onClose={() => navigate('/')} centered>
        <Stack justify="center" align="center">
          <ThemeIcon variant="light" size="70" radius="xl">
            <IconShare />
          </ThemeIcon>
          <Title order={4} fz="md" ta="center" fw={500}>
            You received a list from{' '}
            <Box component="span" c="base">
              {name}
            </Box>
          </Title>
        </Stack>
        <Divider my="md" />
        <Stack>
          <TextInput label="Set your name" size="md" radius="md" />
          <Button size="md" radius="md" fullWidth loading={isSharing} onClick={handleAccpetShare}>
            Accept
          </Button>
        </Stack>
      </Modal>
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
