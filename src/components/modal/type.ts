import { ReactNode } from 'react';

export type TModalProps = {
  title: string;
  onClose: () => void;
  isOrder?: boolean;
  children?: ReactNode;
};
