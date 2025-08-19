import * as React from 'react';

import { CheckViewProps } from './Check.types';

export default function CheckView(props: CheckViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
