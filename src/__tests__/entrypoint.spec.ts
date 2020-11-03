import { createAppWithStacks } from '../entrypoint';

describe('Entrypoint', () => {
    describe('createAppWithStacks', () => {
        it('is returning a new App', () => {
            const app = createAppWithStacks([]);
            expect(typeof app.synth).toEqual('function');
        });
        it('is registering the stacks to the App', () => {
            const stackMock = jest.fn();
            const stacks = [
                {
                    name: 'teststack',
                    kind: stackMock
                },
                {
                    name: 'anotherteststack',
                    kind: stackMock
                }
            ]
            createAppWithStacks(stacks);
            expect(stackMock.mock.instances.length).toBe(2);
        });
    });
});
