import { useState } from 'react';
import { IconThumbUp } from '@tabler/icons-react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  List as MantineList,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ListForm } from '@/components/ListForm/ListForm';
import { type List } from '@/service/models/types';
import { useList } from '@/service/queries/list';

export const ExplorePage = () => {
  const { data: lists, isLoading: isListsLoading } = useList({
    isPublic: true,
  });
  const [selectedList, setSelectedList] = useState<List>();
  const [openedCopy, { open: openCopy, close: closeCopy }] = useDisclosure();
  const [openedPreview, { open: openPreview, close: closePreview }] = useDisclosure();

  // Mutations

  // Handles
  const handleSelectList = (list: List) => {
    setSelectedList(list);
    openCopy();
  };

  const handlePreview = (list: List) => {
    setSelectedList(list);
    openPreview();
  };

  if (isListsLoading) {
    return (
      <Center flex={1} h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!lists) {
    return (
      <Center flex={1} h="100vh">
        No lists found
      </Center>
    );
  }

  return (
    <Stack flex={1} p="md">
      <Flex justify="space-between">
        <Title order={2}>Explore Lists</Title>
        {/* <MonthSelect
          currentDate={currentDate}
          setValue={setValue}
          nextMonth={nextMonth}
          previousMonth={previousMonth}
          formattedMonth={formattedMonth}
        /> */}
      </Flex>
      <Grid>
        {lists?.map((list) => (
          <Grid.Col
            key={list.id}
            span={{
              xs: 12,
              sm: 6,
              md: 6,
              lg: 6,
            }}
          >
            <Card>
              <Card.Section p="md">
                <Group align="center" justify="space-between">
                  <Box>
                    <Title order={4}>{list.title}</Title>
                    <Text size="sm" c="dimmed">
                      {list.description || 'No description'}
                    </Text>
                  </Box>
                  {/* <ActionIcon>
                    <IconThumbUp size={16} />
                  </ActionIcon> */}
                </Group>
                <Group mt="md" gap="xs">
                  <Avatar name={list.owner.name} size="sm" />
                  <Text size="sm">{list.owner.name}</Text>
                </Group>
                <Divider my="sm" />
                <Flex justify="space-between" align="center">
                  <Text size="xs" c="dimmed">
                    {list.products.length} items
                  </Text>
                  <Group>
                    <Button
                      variant="default"
                      onClick={() => {
                        handlePreview(list);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => {
                        handleSelectList(list);
                      }}
                    >
                      Make a copy
                    </Button>
                  </Group>
                </Flex>
              </Card.Section>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <Modal opened={openedCopy} onClose={closeCopy} title={`Copy ${selectedList?.title}`}>
        <ListForm list={selectedList} onCancel={closeCopy} isCopy />
      </Modal>
      <Modal opened={openedPreview} onClose={closePreview} title={`Preview ${selectedList?.title}`}>
        <MantineList icon={<IconThumbUp size={16} />}>
          {selectedList?.products.map((product) => (
            <MantineList.Item key={product.id}>
              {product.name} {product.quantity} {product.unit} - R${product.price.toFixed(2)}
            </MantineList.Item>
          ))}
        </MantineList>
      </Modal>
    </Stack>
  );
};
