# Site Infrastructure

> **Hardened static website deployment using Docker Swarm on ARMv7 with NGINX, HAProxy, and TLS termination**

A production-ready infrastructure setup for hosting a secure static website on an Odroid (ARMv7) device using Docker Swarm, with IPFire firewall providing HAProxy-based TLS termination and load balancing.

## 🏗️ Architecture Overview

```
Internet (RED)
    ↓
IPFire Firewall (HAProxy + Let's Encrypt TLS)
    ├─ :443 (HTTPS) → TLS termination
    ├─ :80 (HTTP) → 301 redirect to HTTPS
    ↓
Odroid (Docker Swarm Manager)
    ├─ Production: :8080 (host-mode)
    ├─ Canary: :8081 (ingress-mode, /canary path)
    └─ Local Registry: :5000 (host-mode)
```

### Key Components

- **Host**: Odroid (Debian 11, ARMv7, kernel 6.3.1)
- **Container Orchestration**: Docker Swarm (single-node manager)
- **Web Server**: NGINX (unprivileged, read-only containers)
- **Edge Proxy**: HAProxy on IPFire with Let's Encrypt (dehydrated)
- **Image Registry**: Local Docker registry for multi-arch images
- **TLS**: Let's Encrypt certificates via dehydrated

## 🔒 Security Features

- **Read-only containers** with tmpfs mounts for writable directories
- **Unprivileged NGINX** (no root processes)
- **Strict security headers** (CSP, HSTS, X-Frame-Options, etc.)
- **TLS 1.2+** with modern cipher suites
- **Firewall rules** on IPFire for controlled access
- **Health checks** for automatic container recovery
- **Multi-architecture images** (amd64, arm64, armv7)

## 📁 Repository Structure

```
.
├── README.md                                    # This file
└── static-site/
    ├── Dockerfile                               # ARMv7 NGINX image
    ├── Makefile                                 # Build automation
    ├── nginx.conf                               # NGINX configuration
    ├── compose.yaml                             # Docker Compose (dev)
    ├── stack.yaml                               # Docker Stack (production)
    └── site/                                    # Static website content
        ├── index.html
        ├── 404.html
        ├── styles.css
        └── scripts.js
```

## 🚀 Quick Start

### Prerequisites

- Odroid or similar ARMv7 device with Debian 11+
- Docker 20.10+ with Swarm mode enabled
- IPFire firewall (optional, for production TLS)
- Domain name with DNS configured

### 1. Initialize Docker Swarm

```bash
docker swarm init
docker node ls
```

### 2. Deploy Local Registry

```bash
docker service create --name registry \
  --constraint 'node.role == manager' \
  --mount type=bind,src=/var/lib/registry,dst=/var/lib/registry \
  --publish mode=host,published=5000,target=5000 \
  registry:2
```

### 3. Build and Push Image

```bash
cd static-site
make build
make push
```

### 4. Deploy Production Stack

```bash
docker stack deploy --with-registry-auth --resolve-image=never \
  -c stack.yaml simple-web-stack
```

### 5. Verify Deployment

```bash
docker service ps simple-web-stack_web
curl -I http://localhost:8080/
```

## 📖 Documentation

### Comprehensive Guides

- **[Complete Deployment Playbook](socket23_static_site_playbook.md)** - Full step-by-step guide covering:
  - Docker Swarm setup and node management
  - Local registry configuration
  - Image building for ARMv7
  - Production and canary deployments
  - HAProxy configuration with TLS
  - Troubleshooting common issues

- **[IPFire Firewall Configuration](socket23_static_site_playbook%20(1).md)** - Firewall rules for internet exposure:
  - iptables rules for ports 80/443
  - HAProxy setup on IPFire
  - Let's Encrypt certificate management

### Key Concepts

#### Host-Mode vs Ingress Publishing

- **Production (host-mode)**: Direct port binding on `:8080` for deterministic routing
- **Canary (ingress-mode)**: Swarm routing mesh on `:8081` for testing new features

#### Read-Only Containers

All containers run with `read_only: true` and use tmpfs mounts for directories that need write access:

```yaml
read_only: true
volumes:
  - type: tmpfs
    target: /var/cache/nginx
  - type: tmpfs
    target: /var/run
  - type: tmpfs
    target: /var/log/nginx
```

#### Canary Deployments

Access canary version via `/canary` path:
- Production: `https://socket23.com/` → `:8080`
- Canary: `https://socket23.com/canary/` → `:8081`

## 🛠️ Common Operations

### Update Website Content

```bash
# Edit files in static-site/site/
cd static-site
make build push
docker service update --image localhost:5000/simple-arm7-web:latest simple-web-stack_web
```

### View Logs

```bash
docker service logs -f simple-web-stack_web
```

### Scale Service

```bash
# Note: Only works with ingress mode, not host mode
docker service scale web-canary_web=3
```

### Health Check

```bash
docker service ps simple-web-stack_web
curl -I http://localhost:8080/
```

## 🐛 Troubleshooting

### Container Crashes with "Read-only file system"

**Solution**: Add tmpfs mounts for directories NGINX needs to write to:
- `/var/cache/nginx`
- `/var/run`
- `/var/log/nginx`

### Port Already in Use

**Solution**: Use `stop-first` update strategy for host-mode services:

```yaml
deploy:
  update_config:
    order: stop-first
```

### External Access Not Working

**Solution**: Check IPFire firewall rules allow ports 80/443:

```bash
iptables -C INPUT -i red0 -p tcp --dport 80 -j ACCEPT
iptables -C INPUT -i red0 -p tcp --dport 443 -j ACCEPT
```

### Image Pull Failures

**Solution**: Use `--resolve-image=never` to prevent digest resolution issues:

```bash
docker stack deploy --with-registry-auth --resolve-image=never -c stack.yaml simple-web-stack
```

## 📊 Monitoring

### Service Status

```bash
docker service ls
docker service ps simple-web-stack_web --no-trunc
```

### Resource Usage

```bash
docker stats
```

### HAProxy Stats (if enabled)

Access HAProxy statistics page (configure in haproxy.cfg):
```
http://firewall-ip:8404/stats
```

## 🔄 Deployment Strategy

1. **Development**: Test locally with `docker-compose up`
2. **Build**: Create multi-arch image with `make build`
3. **Push**: Upload to local registry with `make push`
4. **Canary**: Deploy to `:8081` and test via `/canary` path
5. **Production**: Update production stack on `:8080`
6. **Verify**: Check health and logs

## 📝 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

This is a personal infrastructure project. Feel free to fork and adapt for your own use.

## 📧 Contact

- **Domain**: socket23.com
- **GitHub**: [@socket23](https://github.com/socket23)
- **Discord**: socket23#4198

---

**Built with ❤️ for secure, reproducible infrastructure**

