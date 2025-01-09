import dayjs from 'dayjs';
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  NumberInput,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ShoppingItem } from '@/service/api';

const ListFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  badge: z.string(),
  date: z
    .date()
    .optional()
    .transform((date) => dayjs(date).format('YYYY-MM-DD')),
  description: z.string().optional(),
});

export type List = {
  id: string;
  name: string;
  badge: string;
  date: string;
  description: string;
  items: ShoppingItem[];
};

type ListFormProps = {
  data?: List;
  onCancel?: () => void;
};

export const ListForm: React.FC<ListFormProps> = ({ onCancel, data }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',

    initialValues: {
      name: data?.name || '',
      badge: data?.badge || '',
      date: dayjs(data?.date).toDate(),
      description: data?.description || '',
    },
    validate: zodResolver(ListFormSchema),
  });

  const handleCreate = (values: typeof form.values) => {
    notifications.show({
      title: 'Success',
      message: JSON.stringify(ListFormSchema.parse(values)),
      color: 'green',
    });

    onCancel?.();
  };

  return (
    <form onSubmit={form.onSubmit(handleCreate)}>
      <Grid>
        <Grid.Col span={12}>
          <TextInput
            label="Name"
            placeholder="ex: name of list"
            {...form.getInputProps('name')}
            error={form.errors.name}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            label="Budget"
            prefix="R$ "
            thousandSeparator=","
            defaultValue={1_000_000}
            {...form.getInputProps('badge')}
            error={form.errors.badge}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Button fullWidth variant="transparent" size="xs" onClick={toggle}>
            {!opened ? (
              <IconChevronDown size={16} stroke={1.5} />
            ) : (
              <IconChevronUp size={16} stroke={1.5} />
            )}
          </Button>
          <Collapse in={opened}>
            <Grid>
              <Grid.Col span={12}>
                <DateInput
                  label="Date"
                  placeholder="10/10/2023"
                  {...form.getInputProps('date')}
                  error={form.errors.date}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Description"
                  placeholder="ex: description of list"
                  {...form.getInputProps('description')}
                  error={form.errors.description}
                />
              </Grid.Col>
            </Grid>
          </Collapse>
        </Grid.Col>
      </Grid>
      <Divider my="md" />
      <Group mt="lg" justify="space-between">
        <Tooltip label="Remove">
          <ActionIcon color="red" variant="outline" size="lg">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Group gap="xs">
          <Button variant="outline" color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Group>
    </form>
  );
};
