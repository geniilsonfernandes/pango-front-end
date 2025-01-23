import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@mantine/core';
import { useCreateAnonymous } from '@/service/queries/user';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { SideNavigation } from '../SideNavigation/SideNavigation';
import classes from './AppWrapper.module.css';

export const AppWrapper = () => {
  const [colapsed, setCollapsed] = useState(false);
  const { modals, closeAllModals } = useModalStore();
  const { user, login } = useUserStore();
  const queryClient = useQueryClient();

  // mutations
  const { mutate: createAnonymous } = useCreateAnonymous();

  useEffect(() => {
    if (!user) {
      createAnonymous(undefined, {
        onSuccess: (data) => {
          login(data.user, data.session);
          closeAllModals();
          queryClient.invalidateQueries();
        },
      });
    }
  }, []);

  return (
    <Flex
      mih="100vh"
      maw={{
        base: '100%',
        md: '80rem',
      }}
      mx="auto"
    >
      <Box p="md" h="100vh" w={250} className={classes.sideNav} data-closed={colapsed}>
        <SideNavigation
          collapsed={colapsed}
          onCollapse={() => setCollapsed(!colapsed)}
          aria-hidden={colapsed}
        />
      </Box>

      <Outlet />

      <AuthenticationModal
        opened={modals.auth}
        onClose={closeAllModals}
        size="xl"
        withCloseButton={false}
        zIndex={1000}
      />
      <SettingsModal
        opened={modals.settings || modals.profile}
        onClose={closeAllModals}
        zIndex={100}
      />
    </Flex>
  );
};
