import { IconMenu } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Flex,
  Group,
  Paper,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ProductCheckbox } from '@/components/ProductCheckbox/ProductCheckbox';
import { ProductManager } from '@/components/ProductManager/ProductManager';
import { SideNavigation } from '@/components/SideNavigation/SideNavigation';
import { useListStore } from '@/store/listStore';

export function HomePage() {
  const {
    list: { products },
  } = useListStore();
  return (
    <Flex
      component={Paper}
      style={{
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))',
      }}
      direction="column"
      h="100vh"
      px="gr"
      gap="sm"
      py="xl"
    >
      <Flex gap="lg" flex={1}>
        <SideNavigation initialValue={0} step={1} />
        <Flex
          flex={1}
          p="sm"
          style={{
            display: 'flex',
            gap: rem(32),
          }}
        >
          <Box flex={1}>
            <Flex justify="space-between" align="center" my="lg" px="md">
              <Box>
                <Title order={1} fz="xl">
                  Lista de Novembro
                </Title>
                <Title order={3} fz="xs" fw={400} c="dimmed">
                  12 de novembro de 2021
                </Title>
              </Box>
              <Group gap="xs">
                <AvatarGroup>
                  <Avatar
                    size="sm"
                    src="https://images.unsplash.com/photo-1612838320302-47e0f8e0d7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                  />
                  <Avatar
                    size="sm"
                    src="https://images.unsplash.com/photo-1612838320302-47e0f8e0d7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                  />
                </AvatarGroup>
                <ActionIcon variant="subtle" color="gray">
                  <IconMenu size={18} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Flex>
            <Paper p="xxs" component={Stack} gap="xxs">
              {products?.map((product) => (
                <ProductCheckbox key={product.name} name={product.name} product={product} />
              ))}

              <Stack pt="xs" gap="xxs">
                <Group px="xs" pb="xs" justify="space-between">
                  <Text fw={500} fz="xs" c="dimmed">
                    Checked Items
                  </Text>
                  <Badge variant="outline" size="xs" radius="xl">
                    Clear
                  </Badge>
                </Group>
              </Stack>
            </Paper>
          </Box>

          <ProductManager />
        </Flex>
      </Flex>
    </Flex>
  );
}
