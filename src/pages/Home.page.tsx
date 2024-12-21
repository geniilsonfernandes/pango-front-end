import { IconMenu, IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { SideNavigation } from '@/components/SideNavigation/SideNavigation';
import { products } from '@/dummyData';

const ItemCheckbox = ({ checked, opacity }: { checked?: boolean; opacity?: number }) => {
  return (
    <Checkbox.Card
      checked={checked}
      opacity={opacity}
      styles={{
        card: {
          border: 'none',
        },
      }}
      tabIndex={0}
    >
      <Flex p="sm" py="xs" align="center" justify="space-between" gap={12}>
        <Group gap="xs">
          <Checkbox.Indicator />
          <Title order={3} fz="sm" fw={500}>
            Buy milk
          </Title>
        </Group>
        <Group gap="xs">
          <Text c="gray" fz="xs">
            2L
          </Text>
          <Text c="gray" fz="xs" fw="bolder">
            $2.99
          </Text>
        </Group>
      </Flex>
    </Checkbox.Card>
  );
};

export function HomePage() {
  return (
    <Flex component={Paper} direction="column" h="100vh" px="gr" gap="sm" py="xl">
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
            <Flex justify="space-between" align="center" my="lg">
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
              <ItemCheckbox />
              <ItemCheckbox />
              <ItemCheckbox />
              <ItemCheckbox />
              <Stack pt="xs" gap="xxs">
                <Group px="xs" pb="xs" justify="space-between">
                  <Text fw={500} fz="xs" c="dimmed">
                    Checked Items
                  </Text>
                  <Badge variant="outline" size="xs" radius="xl">
                    Clear
                  </Badge>
                </Group>
                <ItemCheckbox opacity={0.5} />
                <ItemCheckbox opacity={0.5} />
                <ItemCheckbox opacity={0.5} />
              </Stack>
            </Paper>
          </Box>

          <Paper p="sm" w={350} withBorder shadow="md">
            <Flex justify="space-between" align="center">
              <Title order={3} fz="md">
                Add products
              </Title>
              <ActionIcon variant="light" color="gray" radius="xl">
                <IconX size={18} stroke={1.5} />
              </ActionIcon>
            </Flex>
            <TextInput
              mt="lg"
              variant="filled"
              size="md"
              placeholder="Search for products"
              rightSectionWidth={42}
              leftSection={<IconSearch size={18} stroke={1.5} />}
            />
            <Stack pt="xs" gap="xxs">
              {products.map((product) => (
                <Button
                  variant="subtle"
                  color="gray"
                  justify="flex-start"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                >
                  {product.name}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Flex>
      </Flex>
    </Flex>
  );
}
