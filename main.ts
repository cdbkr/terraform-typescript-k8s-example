import { ClusterStack } from './src/stacks/cluster/cluster';
import { createAppWithStacks } from './src/entrypoint';

export const stacks = [
  {
    name: 'ClusterStack',
    kind: ClusterStack
  }
];

const app = createAppWithStacks(stacks);
app.synth();
