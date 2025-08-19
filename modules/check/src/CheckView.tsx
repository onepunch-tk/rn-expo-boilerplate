import { requireNativeView } from 'expo';
import * as React from 'react';

import { CheckViewProps } from './Check.types';

const NativeView: React.ComponentType<CheckViewProps> =
  requireNativeView('Check');

export default function CheckView(props: CheckViewProps) {
  return <NativeView {...props} />;
}
