import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Box, Center, Flex, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { userAPI } from '@/service/api';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { SideNavigation } from '../SideNavigation/SideNavigation';
import { Welcoming } from '../Welcoming/Welcoming';
import classes from './AppWrapper.module.css';

export const AppWrapper = () => {
  const [colapsed, setCollapsed] = useState(false);
  const { modals, closeAllModals, openModal, closeModal } = useModalStore();
  const { user, logout } = useUserStore();
  const isTablet = useMediaQuery('(max-width: 768px)');
  const { isLoading, data } = useQuery({
    queryKey: ['user', 'verify'],
    queryFn: () => userAPI?.verifyToken(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data && !user) {
      logout();
      openModal('welcoming');
    }
  }, []);

  useEffect(() => {
    if (isTablet) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isTablet]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

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

        <Welcoming opened={modals.welcoming} onClose={() => closeAllModals()} />

        <AuthenticationModal
          opened={modals.auth}
          onClose={() => closeModal('auth')}
          size="xl"
          withCloseButton={false}
          zIndex={400}
        />
        <SettingsModal
          opened={modals.settings || modals.profile}
          onClose={() => closeModal('settings')}
          zIndex={200}
        />
      </Flex>
      {isTablet && user && <MobileNavigation />}
    </>
  );
};
