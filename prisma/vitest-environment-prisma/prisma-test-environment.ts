/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import { Environment } from 'vitest';

export default <Environment>{
  name: 'prisma',
  async setup() {
    return {
      async teardown() { }
    };
  }
};