import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Button, Popover } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { UseCalendarResult } from '@/hooks/useCalendar';

type MonthSelectProps = {} & UseCalendarResult;

export const MonthSelect: React.FC<MonthSelectProps> = ({
  currentDate,
  setValue,
  nextMonth,
  previousMonth,
}) => {
  return (
    <Button.Group>
      <Button variant="default" onClick={previousMonth}>
        <IconChevronLeft width={16} height={16} />
      </Button>
      <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Button.GroupSection variant="default" miw={200} bg="var(--mantine-color-body)">
            {currentDate.format('MMMM YYYY')}
          </Button.GroupSection>
        </Popover.Target>
        <Popover.Dropdown>
          <MonthPicker value={currentDate.toDate()} onChange={setValue} />
        </Popover.Dropdown>
      </Popover>
      <Button variant="default" onClick={nextMonth}>
        <IconChevronRight width={16} height={16} />
      </Button>
    </Button.Group>
  );
};
