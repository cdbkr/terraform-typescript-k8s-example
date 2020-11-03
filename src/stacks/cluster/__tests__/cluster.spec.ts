import { App } from 'cdktf';
import { ClusterStack } from '../cluster';

describe('ClusterStack', () => {
    const createTestStack = (): ClusterStack => {
        const app = new App();
        return new ClusterStack(app, 'test');
    }
    describe('Namespace', () => {
        it('is creating a namespace with the right name', () => {
            const instance = createTestStack();
            expect(instance.nginxNamespace['_metadata'][0].name).toEqual('tf-cdk-nginx');
        });
    });
    describe('Deployment', () => {
        it('is creating a deployment with the right name', () => {
            const instance = createTestStack();
            expect(instance.nginxDeployment['_metadata'][0].name).toEqual('nginx-example-tf');
        });
        it('is labelling the deployment with `app`', () => {
            const instance = createTestStack();
            const labels = instance.nginxDeployment['_metadata'][0].labels || {};
            expect(labels['app']).toEqual('nginx-example-tf');
        });
        it('is spawning 2 replicas', () => {
            const instance = createTestStack();
            expect(instance.nginxDeployment.specInput[0].replicas).toEqual(2);
        });
        it('is spawning only one container', () => {
            const instance = createTestStack();
            expect(instance.nginxDeployment.specInput[0].template.length).toEqual(1);
        });
        it('is spawning a nginx container with the nginx image ', () => {
            const instance = createTestStack();
            const [ template ] = instance.nginxDeployment.specInput[0].template;
            const { container = [] } = template.spec[0];
            const [ containerSpec ] = container;
            expect(containerSpec.image).toEqual('nginx:1.7.8');
        });
    });
    describe('Service', () => {
        it('is creating a service with the right name', () => {
            const instance = createTestStack();
            expect(instance.nginxService['_metadata'][0].name).toEqual('nginx-example-tf');
        });
        it('is creating a service in the right namespace', () => {
            const instance = createTestStack();
            expect(instance.nginxService['_metadata'][0].namespace).toEqual('tf-cdk-nginx');
        });
        it('is applying the service to the resources with the right `app` label', () => {
            const instance = createTestStack();
            const selectors = instance.nginxService.specInput[0].selector|| {};
            expect(selectors['app']).toEqual('nginx-example-tf');
        });
        it('is exposing the service with type `NodePort`', () => {
            const instance = createTestStack();
            expect(instance.nginxService.specInput[0].type).toEqual('NodePort');
        });
    });
})
