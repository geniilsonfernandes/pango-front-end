import { IconLink, IconLock, IconShare } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Button, Divider, Flex, Group, Modal, ModalProps, Text, Title } from '@mantine/core';
import { useCreateAnonymous } from '@/service/queries/user';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { Logo } from '../Logo/Logo';

type WelcomingProps = {} & ModalProps;

export const Welcoming: React.FC<WelcomingProps> = ({ opened }) => {
  const { openModal, closeAllModals } = useModalStore();

  const { login } = useUserStore();
  const queryClient = useQueryClient();

  // mutations
  const { mutate: createAnonymous, isLoading: isCreating } = useCreateAnonymous();

  // handles

  const createAnonymousUser = () => {
    createAnonymous(undefined, {
      onSuccess: (data) => {
        login(data.user, data.session);
        closeAllModals();
        queryClient.invalidateQueries();
      },
    });
  };
  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      size="xl"
      overlayProps={{ opacity: 0.9, blur: 10 }}
      withCloseButton={false}
      centered
    >
      <Box my="xl">
        <Flex justify="center" my="50px">
          <Logo />
        </Flex>
        <Title size="xl" ta="center" mt="md">
          Welcome to Pango List!
        </Title>
        <Text size="md" ta="center" c="green.7">
          Get started by creating your first list.
        </Text>
      </Box>
      <Flex justify="space-around" mt="lg">
        {[
          {
            icon: <IconShare size={24} stroke={1.5} color="green" />,
            title: 'Share lists',
            description: 'Share lists with your friends',
          },
          {
            icon: <IconLink size={24} stroke={1.5} color="blue" />,
            title: 'Sync lists',
            description: 'Keep your lists updated across devices',
          },
          {
            icon: <IconLock size={24} stroke={1.5} color="red" />,
            title: 'Secure lists',
            description: 'Protect your lists with secure storage',
          },
        ].map((item, index) => (
          <Box key={index} flex={1} ta="center">
            {item.icon}
            <Title order={4} fz="sm" mt="sm">
              {item.title}
            </Title>
            <Text fz="xs" c="dimmed">
              {item.description}
            </Text>
          </Box>
        ))}
      </Flex>
      <Divider my="md" />
      <Text ta="center" c="dimmed" fz="sm" mb="md">
        Already have an account?
      </Text>
      <Group justify="center">
        <Button
          variant="light"
          onClick={() => {
            openModal('auth');
          }}
        >
          Log in/Sign up
        </Button>
        <Button variant="light" onClick={createAnonymousUser} loading={isCreating}>
          continue as guest
        </Button>
      </Group>
    </Modal>
  );
};
