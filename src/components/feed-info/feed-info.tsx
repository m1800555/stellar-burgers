import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { getIsLoading } from '../../services/slices/orders';
import {
  getAllFeeds,
  getTotal,
  getTotalToday
} from '../../services/slices/feed';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getAllFeeds);
  const feed = {
    total: useSelector(getTotal),
    totalToday: useSelector(getTotalToday)
  };
  const isLoading = useSelector(getIsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
