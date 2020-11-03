import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { Deployment,
    KubernetesProvider,
    Namespace,
    Service
} from '../../../.gen/providers/kubernetes';

export class ClusterStack extends TerraformStack {
    nginxDeployment!: Deployment;
    nginxService!: Service;
    nginxNamespace!: Namespace;
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new KubernetesProvider(this, 'kind', {});

        this.gatherResources();
    }
    gatherResources(this: ClusterStack) {
        const app = 'nginx-example-tf'
        const namespace = 'tf-cdk-nginx'
        this.nginxNamespace = new Namespace(this, 'tf-cdk-example', {
            metadata: [{
                name: namespace
            }]
        });
        this.nginxDeployment = new Deployment(this, 'nginx-deployment', {
            metadata: [{
                name: app,
                namespace,
                labels: {
                    app
                }
            }],
            spec: [{
                replicas: 2,
                selector: [{
                    matchLabels: {
                        app
                    }
                }],
                template: [{
                    metadata: [{
                        labels: {
                            app
                        }
                    }],
                    spec: [{
                        container: [{
                            image: 'nginx:1.7.8',
                            name: 'nginx',
                            port: [{
                                containerPort: 80
                            }],
                            resources: [{
                                limits: [{
                                    cpu: '0.5',
                                    memory: '512Mi'
                                }],
                                requests: [{
                                    cpu: '250m',
                                    memory: '50Mi'
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        });

        this.nginxService = new Service(this, 'nginx-service', {
            metadata: [{
                name: app,
                namespace,
            }],
            spec: [{
                selector: {
                    app
                },
                port: [{
                    nodePort: 30201,
                    port: 80,
                    targetPort: '80'
                }],
                type: 'NodePort'
            }]
        });
    }
}
