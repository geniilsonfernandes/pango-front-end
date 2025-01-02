import { Box, Flex, Stack, Text, Title } from '@mantine/core';
import { ListActions } from '../ListActions/ListActions';
import { ListStats } from '../ListStats/ListStats';

type ListHeaderProps = {
  listName: string;
  createdAt: string;
};

// Subcomponent: HeaderDetails
const HeaderDetails: React.FC<{ listName: string; createdAt: string }> = ({
  listName,
  createdAt,
}) => (
  <Box>
    <Title order={1} fz="xl">
      {listName}
    </Title>
    <Text fz="xs" fw={400} c="dimmed">
      {createdAt}
    </Text>
  </Box>
);

export const ListHeader: React.FC<ListHeaderProps> = ({ createdAt, listName }) => {
  return (
    <Stack gap="md" mb="md">
      <Flex justify="space-between" align="center">
        <HeaderDetails listName={listName} createdAt={createdAt} />
        <ListActions />
      </Flex>
      <ListStats
        totalItems="10 / 100"
        budget="$5,431 / $10,000"
        checked="$5,431"
        unchecked="$4,569"
        progress={50}
      />
    </Stack>
  );
};
