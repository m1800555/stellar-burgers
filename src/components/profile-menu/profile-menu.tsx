import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getRequestStatus, logoutUser } from '../../services/slices/user';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const requestStatus = useSelector(getRequestStatus);

  if (requestStatus === 'pending') return <Preloader />;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
