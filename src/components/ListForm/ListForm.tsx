import dayjs from 'dayjs';
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  Modal,
  ModalProps,
  NumberInput,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { ListDTO } from '@/service/api';
import {
  listQueryKeys,
  useCreateList,
  useDeleteList,
  useUpdateList,
} from '@/service/queries/useList';

type DeleteConfirmationProps = {
  onDeleteList: () => void;
  isDeleting: boolean;
} & ModalProps;

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onDeleteList,
  opened,
  isDeleting,
  onClose,
}) => (
  <Modal opened={opened} onClose={onClose} title="Delete list">
    Are you sure you want to delete this list?
    <Group mt="lg" justify="flex-end" gap="xs">
      <Button onClick={onClose} variant="default">
        Cancel
      </Button>
      <Button onClick={onDeleteList} loading={isDeleting} color="red">
        Delete
      </Button>
    </Group>
  </Modal>
);

const ListFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  budget: z.number().optional(),
  date: z
    .date()
    .optional()
    .transform((date) => dayjs(date).format('YYYY-MM-DD')),
  description: z.string().optional(),
});

type ListFormProps = {
  list?: ListDTO;
  onCancel?: () => void;
  isCopy?: boolean;
};

export const ListForm: React.FC<ListFormProps> = ({ onCancel, list, isCopy }) => {
  // Hooks
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openedOptions, { toggle: toggleOptions }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Mutations
  const { mutate: createList, isLoading: isCreating } = useCreateList();
  const { mutate: updateList, isLoading: isUpdating } = useUpdateList();
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList();

  // Form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: isCopy ? `Copy of ${list?.name}` : list?.name || '',
      budget: list?.budget || 0,
      date: dayjs(list?.date).toDate(),
      description: list?.description || '',
    },
    validate: zodResolver(ListFormSchema),
  });

  // Handlers
  const handleCreate = (values: typeof form.values) => {
    if (list?.id && !isCopy) {
      updateList({
        id: list.id,
        ...ListFormSchema.parse(values),
      });
    } else {
      createList(ListFormSchema.parse(values), {
        onSuccess: (data) => {
          navigate(`/shopping-lists/${data.id}`);
        },
      });
    }

    onCancel?.();
  };

  const handleDelete = () => {
    if (list?.id) {
      deleteList(list.id, {
        onSuccess: () => {
          queryClient.invalidateQueries(listQueryKeys.getList(list?.id));
          onCancel?.();
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleCreate)}>
        <Grid opacity={isCreating || isDeleting ? 0.5 : 1}>
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
              {...form.getInputProps('budget')}
              error={form.errors.budget}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button fullWidth variant="transparent" size="xs" onClick={toggleOptions}>
              {!openedOptions ? (
                <IconChevronDown size={16} stroke={1.5} />
              ) : (
                <IconChevronUp size={16} stroke={1.5} />
              )}
            </Button>
            <Collapse in={openedOptions}>
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
            <ActionIcon onClick={openDelete} color="red" variant="outline" size="lg">
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Group gap="xs">
            <Button variant="default" color="gray" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              Save
            </Button>
          </Group>
        </Group>
      </form>
      <DeleteConfirmation
        opened={openedDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
        onDeleteList={handleDelete}
      />
    </>
  );
};
