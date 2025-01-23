import { useRef, useState } from 'react';
import {
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconLink,
  IconList,
  IconSend,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { List, Product } from '@/service/models/types';
import { useDeleteList } from '@/service/queries/list';
import { ListActions } from '../ListActions/ListActions';
import { DeleteConfirmation, ListForm } from '../ListForm/ListForm';
import { PrintableList } from '../PrintableList/PrintableList';

type ListHeaderProps = {
  list: List;
  products: Product[];
};

export const ListHeader: React.FC<ListHeaderProps> = ({ list, products }) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure();
  const [openedShare, { open: openShare, close: closeShare }] = useDisclosure();
  const [openedCopy, { open: openCopy, close: closeCopy }] = useDisclosure();
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure();
  const [openedPrint, { open: openPrint, close: closePrint }] = useDisclosure();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [printSettings, setPrintSettings] = useState<string[]>(['grouped']);

  // Mutations
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList();

  // handles
  const handleDelete = () => {
    if (list.id) {
      deleteList(list.id, {
        onSuccess: () => {
          closeDelete();
          navigate('/');
        },
      });
    }
  };

  const generateListUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => notifications.show({ message: 'URL copiada para o clipboard!', color: 'green' }),
      (err) => notifications.show({ message: `Erro ao copiar URL: ${err}`, color: 'red' })
    );
  };

  const generateShareMessage = (list: List, products: Product[]): string => {
    let message = `*${list.title}*\n\n${list.description}\n\nItens da lista:\n`;

    products.forEach((product) => {
      message += `• ${product.name} (${product.quantity} ${product?.unit || 'unit'}) - R$${product.price.toFixed(2)}\n`;
    });

    if (list.budget) {
      message += `\n*Orçamento Total:* R$${list.budget.toFixed(2)}\n`;
    }

    const url = window.location.href;
    message += `\nConfira a lista completa aqui: ${url}`;

    return message;
  };

  const shareListOnPlatform = (platform: 'whatsapp' | 'telegram') => {
    const message = generateShareMessage(list, products);

    const url =
      platform === 'whatsapp'
        ? `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
        : `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  const copyListToClipboard = () => {
    const message = generateShareMessage(list, products);

    navigator.clipboard.writeText(message).then(
      () => notifications.show({ message: 'Mensagem copiada para o clipboard!', color: 'green' }),
      (err) => notifications.show({ message: `Erro ao copiar mensagem: ${err}`, color: 'red' })
    );
  };

  return (
    <Flex align="center" justify="space-between" gap="xs">
      <Title
        order={1}
        fz={{
          base: 'md',
          sm: 'lg',
        }}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '60%',
        }}
      >
        {list.title}
      </Title>
      <ListActions
        onEdit={open}
        onShare={openShare}
        onCopy={openCopy}
        onDelete={openDelete}
        onPrint={openPrint}
      />

      <DeleteConfirmation
        opened={openedDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
        onDeleteList={handleDelete}
      />

      <Modal opened={opened} onClose={close} title={`Edit ${list.title}`}>
        <ListForm list={list} onCancel={close} />
      </Modal>
      <Modal opened={openedCopy} onClose={closeCopy} title={`Copy ${list.title}`}>
        <ListForm list={list} onCancel={closeCopy} isCopy />
      </Modal>
      <Modal opened={openedPrint} onClose={closePrint} title={`Print ${list.title}`}>
        <Checkbox.Group
          label="Print Options"
          description="Select what you want to print"
          defaultValue={['grouped']}
          onChange={setPrintSettings}
          value={printSettings}
        >
          <Stack mt="xs">
            <Checkbox value="grouped" label="Grouped by Categories" />
            <Checkbox value="unchecked" label="Only unchecked items" />
            <Checkbox value="status" label="Print status" />
          </Stack>
        </Checkbox.Group>

        <div ref={contentRef}>
          <PrintableList
            list={list}
            grouped={printSettings.includes('grouped')}
            uncheckedOnly={printSettings.includes('unchecked')}
            showStatus={printSettings.includes('status')}
          />
        </div>

        <Divider my="md" />
        <Group mt="lg" justify="flex-end">
          <Group gap="xs">
            <Button variant="default" color="gray" onClick={closePrint}>
              Cancel
            </Button>
            <Button onClick={() => reactToPrintFn()}> Print</Button>
          </Group>
        </Group>
      </Modal>

      <Modal opened={openedShare} onClose={closeShare} size="sm" title={`Share ${list.title}`}>
        <Group align="flex-start" gap="xs" mt="md">
          <TextInput flex={1} placeholder="hello@gluesticker.com" error="Invalid email" />
          <Button onClick={close} leftSection={<IconSend size={16} />}>
            Send
          </Button>
        </Group>
        <Divider my="md" />
        <Group justify="space-between">
          <Stack gap="xs" align="center">
            <ActionIcon onClick={generateListUrl} size="input-lg">
              <IconLink />
            </ActionIcon>
            <Text size="xs">Copy link</Text>
          </Stack>
          <Stack gap="xs" align="center">
            <ActionIcon onClick={copyListToClipboard} color="teal" size="input-lg">
              <IconList />
            </ActionIcon>
            <Text size="xs">Copy text</Text>
          </Stack>
          <Stack gap="xs" align="center">
            <ActionIcon
              onClick={() => shareListOnPlatform('telegram')}
              color="blue"
              size="input-lg"
            >
              <IconBrandTelegram />
            </ActionIcon>
            <Text size="xs">Telegram</Text>
          </Stack>
          <Stack gap="xs" align="center">
            <ActionIcon
              onClick={() => shareListOnPlatform('whatsapp')}
              color="green"
              size="input-lg"
            >
              <IconBrandWhatsapp />
            </ActionIcon>
            <Text size="xs">WhatsApp</Text>
          </Stack>
        </Group>
      </Modal>
    </Flex>
  );
};
