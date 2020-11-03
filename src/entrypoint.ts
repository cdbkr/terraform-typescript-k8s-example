import { App } from 'cdktf';

export interface Stack {
    kind: any;
    name: string;
}
export type Stacks = Stack[];

export const createAppWithStacks = (stacks: Stacks) => {
    const app = new App();
    for (const stack of stacks) {
        const { kind, name } = stack;
        new kind(app, name);
    }
    return app;
};
