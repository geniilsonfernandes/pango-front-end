import { Flex, Title } from '@mantine/core';
import { ListActions } from '../ListActions/ListActions';

type ListHeaderProps = {
  listName: string;
};

export const ListHeader: React.FC<ListHeaderProps> = ({ listName }) => {
  return (
    <Flex align="center" justify="space-between" gap="xs">
      <Title order={1} fz="xl">
        {listName}
      </Title>
      <ListActions />
    </Flex>
  );
};
