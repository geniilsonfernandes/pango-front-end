import { List, User } from '@/service/models/types';

export const checkPermissions = (list?: List, user?: User) => {
  const isOwner = list?.owner?.id === user?.id;

  if (isOwner) {
    return true;
  }
  const sharedUser = list?.shared_with.find((sharedUser) => sharedUser?.user?.id === user?.id);

  return sharedUser;
};
