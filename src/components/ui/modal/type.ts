import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  isOrder?: boolean;
  children?: ReactNode;
};
