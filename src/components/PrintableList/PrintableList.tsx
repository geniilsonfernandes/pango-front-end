import { IconCheckbox } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { Text, Title } from '@mantine/core';
import { ListDTO } from '@/service/api';
import { List, Product } from '@/service/models/types';
import { RQKEY as RQKEY_PRODUCT } from '../../service/queries/product';
import { ListStats } from '../ListStats/ListStats';
import { Logo } from '../Logo/Logo';
import classes from './PrintableList.module.css';

type PrintableListProps = {
  list: List;
  grouped: boolean;
  uncheckedOnly: boolean;
  showStatus: boolean;
};

const Item: React.FC<{ item: Product }> = ({ item }) => {
  const shortenName = (name: string) => (name.length > 30 ? `${name.slice(0, 30)}...` : name);

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Text size="xs" c="#7B7B7B">
        {item.quantity} {item.unit}
      </Text>
      <Text size="xs">{shortenName(item.name)}</Text>
    </div>
  );
};

const renderGroupedItems = (items: ListDTO['items']) => {
  const categorized = items?.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category]?.push(item);
      return acc;
    },
    {} as Record<string, ListDTO['items']>
  );

  return Object.entries(categorized || {}).map(([category, categoryItems]) => (
    <div key={category}>
      <Title order={4} my="xs">
        {category}
      </Title>
      {categoryItems?.map((item) => <Item key={item.id} item={item} />)}
    </div>
  ));
};

const renderFlatItems = (items: ListDTO['items']) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      padding: '16px 0',
    }}
  >
    {items?.map((item) => <Item key={item.id} item={item} />)}
  </div>
);

export const PrintableList: React.FC<PrintableListProps> = ({
  list,
  showStatus,
  grouped,
  uncheckedOnly,
}) => {
  const queryClient = useQueryClient();
  const listItems = queryClient.getQueryData(RQKEY_PRODUCT(list.id)) as Product[];

  const filterItems = (checked: boolean) =>
    listItems?.filter((item) => item.checked === checked) || [];

  return (
    <div className={classes.printContent}>
      {/* Header */}
      <div className={classes.header}>
        <Logo />
      </div>

      {showStatus && (
        <div className={classes.stats}>
          <ListStats list={list} products={listItems} currencyMode="br" />
        </div>
      )}

      {/* Unchecked Items */}
      <Title
        order={6}
        style={{
          display: 'inline-flex',
          gap: '10px',
          alignItems: 'center',
          border: '1px solid #bdbdbd',
          padding: '16px',
          marginTop: '32px',
          color: '#000',
        }}
      >
        <IconCheckbox /> Unchecked
      </Title>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          padding: '16px 0',
        }}
      >
        {grouped ? renderGroupedItems(filterItems(false)) : renderFlatItems(filterItems(false))}
      </div>

      {/* Checked Items */}
      {!uncheckedOnly && (
        <>
          <Title
            order={6}
            style={{
              display: 'inline-flex',
              gap: '10px',
              alignItems: 'center',
              border: '1px solid #bdbdbd',
              padding: '16px',
              marginTop: '32px',
              color: '#000',
            }}
          >
            <IconCheckbox /> Checked
          </Title>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '16px 0',
            }}
          >
            {grouped ? renderGroupedItems(filterItems(true)) : renderFlatItems(filterItems(true))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className={classes.footer} />
    </div>
  );
};
