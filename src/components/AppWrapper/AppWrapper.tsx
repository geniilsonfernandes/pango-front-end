import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useCreateAnonymous } from '@/service/queries/user';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { SideNavigation } from '../SideNavigation/SideNavigation';
import classes from './AppWrapper.module.css';

export const AppWrapper = () => {
  const [colapsed, setCollapsed] = useState(false);
  const { modals, closeAllModals } = useModalStore();
  const { user, login } = useUserStore();
  const queryClient = useQueryClient();
  const isTablet = useMediaQuery('(max-width: 768px)');

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

  useEffect(() => {
    if (isTablet) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isTablet]);

  return (
    <>
      <Flex
        mih="100vh"
        maw={{
          base: '100%',
          md: '80rem',
        }}
        mx="auto"
        pl={{
          base: 0,
          sm: colapsed ? 40 : 0,
        }}
      >
        {!isTablet && (
          <Box p="md" h="100vh" w={250} className={classes.sideNav} data-closed={colapsed}>
            <SideNavigation
              collapsed={colapsed}
              onCollapse={() => setCollapsed(!colapsed)}
              aria-hidden={colapsed}
            />
          </Box>
        )}
        <Outlet />

        <AuthenticationModal
          opened={modals.auth}
          onClose={closeAllModals}
          size="xl"
          withCloseButton={false}
          zIndex={200}
        />
        <SettingsModal
          opened={modals.settings || modals.profile}
          onClose={closeAllModals}
          zIndex={100}
        />
      </Flex>
      {isTablet && <MobileNavigation />}
    </>
  );
};
