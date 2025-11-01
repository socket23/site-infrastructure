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
    └─ Production: :8080 (host-mode)
```

### Key Components

- **Host**: Odroid (Debian 11, ARMv7, kernel 6.3.1)
- **Container Orchestration**: Docker Swarm (single-node manager)
- **Web Server**: NGINX (unprivileged, read-only containers)
- **Edge Proxy**: HAProxy on IPFire with Let's Encrypt (dehydrated)
- **Image Registry**: GitHub Container Registry (ghcr.io)
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

- Docker 20.10+ with Swarm mode enabled
- ARMv7, ARM64, or AMD64 architecture

### 1. Initialize Docker Swarm

```bash
docker swarm init
```

### 2. Clone and Deploy

```bash
git clone https://github.com/socket23/site-infrastructure.git
cd site-infrastructure/static-site
docker stack deploy -c stack.yaml web
```

### 3. Verify Deployment

```bash
docker service ps web_web
curl -I http://localhost:8080/
```

That's it! The pre-built multi-arch image will be pulled from GitHub Container Registry.

## 📖 Key Concepts

### Host-Mode Publishing

- **Direct port binding** on `:8080` for deterministic routing
- Ensures traffic goes to the specific node where the service is running

### Read-Only Containers

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

## 🛠️ Common Operations

### Update Website Content

```bash
# Edit files in static-site/site/
cd static-site
make build push
docker service update --image ghcr.io/socket23/static-site:latest web_web
```

### View Logs

```bash
docker service logs -f web_web
```

### Scale Service

```bash
# Note: Scaling not recommended with host mode (port conflicts)
# Use ingress mode for multi-replica deployments
docker service scale web_web=1
```

### Health Check

```bash
docker service ps web_web
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

**Solution**: Ensure you have access to the GitHub Container Registry. For private images, authenticate with:

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker stack deploy -c stack.yaml web
```

## 📊 Monitoring

### Service Status

```bash
docker service ls
docker service ps web_web --no-trunc
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

1. **Clone**: Clone the repository
2. **Deploy**: Run `docker stack deploy -c stack.yaml web`
3. **Verify**: Check service health and logs

For custom builds:
1. **Edit**: Modify files in `static-site/site/`
2. **Build**: Create multi-arch image with `make build`
3. **Push**: Upload to GitHub Container Registry with `make push`
4. **Update**: Run `docker service update --image ghcr.io/socket23/static-site:latest web_web`

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

