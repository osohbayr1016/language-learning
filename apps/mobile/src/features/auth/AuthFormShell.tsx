import React from 'react';
import { Platform, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  onSubmit: () => void | Promise<void>;
};

/** On web, wraps fields in a native <form> so Enter submits; native uses a plain View. */
export function AuthFormShell({ children, onSubmit }: Props) {
  if (Platform.OS !== 'web') {
    return <View style={{ width: '100%' }}>{children}</View>;
  }
  return React.createElement(
    'form',
    {
      style: { width: '100%' },
      onSubmit: (e: { preventDefault: () => void }) => {
        e.preventDefault();
        void onSubmit();
      },
    },
    children,
  );
}
