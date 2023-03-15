# Kubernetes Deployment

This folder contains the manifests needed to create the full-stack-todo application in a Kubernetes environment.

### What Is Created

| Name              | Type       | Description                                                                                                                                               |
| ----------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fullstacktodo`   | Namespace  | Namespace used as a logical grouping for all components of the full-stack-todo application                                                                |
| `client`          | Deployment | Definition of the client application deployment using the `ghcr.io/wgd/fst-client` Docker image                                                           |
| `server`          | Deployment | Definition of the server application deployment using the `ghcr.io/wgd/fst-server` Docker image                                                           |
| `mariadb`         | Deployment | Database backend used by the `server` application. Uses the latest `mariadb` image                                                                        |
| `client-svc`      | Service    | Service used for exposing the nginx port on which the container is listening. Also uses a LoadBalancer when possible to assign a specific IP address      |
| `server-svc`      | Service    | Service used for exposing the API port on which the container is listening (3333). Also uses a LoadBalancer when possible to assign a specific IP address |
| `mariadb-svc `    | Service    | Service used for connecting to the database throughout the cluster. Uses a LoadBalancer IP for easier out-of-band troubleshooting                         |
| `env`             | ConfigMap  | Environment variables needed and shared by all applications                                                                                               |
| `database-secret` | Secret     | Base64-encoded strings for snesitive environment variables                                                                                                |

### Deployment

Assuming there is a k8s cluster already available, and `kubectl` is available in your terminal, deployment is as simple as:

```shell
$ kubectl apply -f ./k8s
```

**Note:** This command may need to be run a second time if everything is not applied correctly the first time.
