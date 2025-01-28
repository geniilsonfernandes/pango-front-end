import { useState } from 'react';
import { IconShare } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  rem,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetList, useShareList } from '@/service/queries/list';
import { useEditUser } from '@/service/queries/user';
import useUserStore from '@/store/userStore';

type Params = {
  id: string;
};

export function AcceptListPage() {
  useDocumentTitle(`pango | Accept List`);
  const { user } = useUserStore();
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  // queries
  const { data, isLoading } = useGetList(id);

  // mutations
  const { mutate: editUser } = useEditUser();
  const { mutate: share, isLoading: isSharing } = useShareList();

  // handles

  const handleAccpetShare = () => {
    if (!id) {
      return;
    }
    if (name) {
      editUser({
        id: user?.id as string,
        name,
        email: user?.email as string,
      });
    }
    share(id, {
      onSuccess: () => {
        navigate(`/list/${id}`);
      },
    });
  };

  const checkPermissions = () => {
    const isOwner = data?.owner?.id === user?.id;

    if (isOwner) {
      navigate(`/list/${id}`);
      return true;
    }
    const containsInShared = data?.shared_with.find(
      (sharedUser) => sharedUser?.user?.id === user?.id
    );

    if (containsInShared) {
      navigate(`/list/${id}`);
      return true;
    }

    return containsInShared;
  };

  if (isLoading) {
    return (
      <Center flex={1} h={rem(400)}>
        <Loader />
      </Center>
    );
  }

  if (!checkPermissions()) {
    return (
      <Modal opened onClose={() => navigate('/')} centered>
        <Stack justify="center" align="center">
          <ThemeIcon variant="light" size="70" radius="xl">
            <IconShare />
          </ThemeIcon>
          <Title order={4} fz="md" ta="center" fw={500}>
            You received a list from{' '}
            <Box component="span" c="base">
              {data?.owner.email ?? 'unknown'}
            </Box>
          </Title>
        </Stack>
        <Divider my="md" />
        <Stack>
          <TextInput
            label="Set your name"
            size="md"
            radius="md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button size="md" radius="md" fullWidth loading={isSharing} onClick={handleAccpetShare}>
            Accept
          </Button>
        </Stack>
      </Modal>
    );
  }

  return (
    <Center flex={1}>
      <Stack flex={1} h={rem(400)} align="center" justify="center">
        <Title>Nothing to see here</Title>
        <Text c="dimmed" size="lg" ta="center">
          This list is private or you don`t have permission, contact the owner of the list to see it
          or share it with you.
        </Text>
        <Group justify="center">
          <Button size="md" onClick={() => navigate('/explore')}>
            Take me back to explore
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
