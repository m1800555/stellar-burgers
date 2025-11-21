import { FC, useCallback, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAllFeeds,
  getFeeds,
  getIsLoading
} from '../../services/slices/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const fetchFeeds = useCallback(() => dispatch(getFeeds()), [dispatch]);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    fetchFeeds();
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getAllFeeds);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        fetchFeeds();
      }}
    />
  );
};
