import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Check.types';

type CheckModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class CheckModule extends NativeModule<CheckModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(CheckModule, 'CheckModule');
