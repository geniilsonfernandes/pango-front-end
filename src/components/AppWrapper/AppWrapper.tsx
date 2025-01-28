import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Center, Flex, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useVerifyAuth } from '@/hooks/useVerifyAuth';
import useModalStore from '@/store/modalStore';
import { AuthenticationModal } from '../AuthenticationModal/AuthenticationModal';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { SideNavigation } from '../SideNavigation/SideNavigation';
import { Welcoming } from '../Welcoming/Welcoming';
import classes from './AppWrapper.module.css';

export const AppWrapper = () => {
  const [colapsed, setCollapsed] = useState(false);

  const { modals, closeAllModals, closeModal } = useModalStore();

  const isTablet = useMediaQuery('(max-width: 768px)');
  const { initialized } = useVerifyAuth();

  useEffect(() => {
    setCollapsed(!!isTablet);
  }, [isTablet]);

  return (
    <>
      {!initialized ? (
        <Center h="100vh">
          <Loader />
        </Center>
      ) : (
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
              zIndex={100}
            />
            <SettingsModal
              opened={modals.settings || modals.profile}
              onClose={() => closeAllModals()}
              zIndex={90}
            />
          </Flex>
          {isTablet && <MobileNavigation />}
        </>
      )}
    </>
  );
};
