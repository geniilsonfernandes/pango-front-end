import { Flex, Progress } from '@mantine/core';
import { DisplayValue } from '../DisplayValue/DisplayValue';

type ListStatsProps = {
  totalItems?: string;
  budget?: string;
  checked?: string;
  unchecked?: string;
  progress: number;
};

export const ListStats: React.FC<ListStatsProps> = ({
  totalItems = '0 / 0',
  budget,
  checked,
  unchecked,
  progress,
}) => (
  <>
    <Flex gap="lg" justify="space-between">
      <DisplayValue value={totalItems} label="Total Items" aria-label="Total Items" />
      <Flex gap="lg" justify="flex-end" align="center">
        <DisplayValue value={budget} label="Budget" aria-label="Budget" />
        <DisplayValue value={checked} label="Checked" aria-label="Checked" />
        <DisplayValue value={unchecked} label="Unchecked" aria-label="Unchecked" />
      </Flex>
    </Flex>
    <Progress value={progress} style={{ width: '100%' }} />
  </>
);