import { notifications } from '@mantine/notifications';


export const successMessage = (message: string) => {
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
    position: 'top-left',
  });
};

export const errorMessage = (message: string) => {
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
    position: 'top-left',
  });
};