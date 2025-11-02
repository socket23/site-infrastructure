# Site Infrastructure

> **Hardened static website deployment using Docker Swarm on ARMv7 with NGINX, HAProxy, and TLS termination**

A production-ready, security-hardened infrastructure setup for hosting a professional static website on an Odroid (ARMv7) device using Docker Swarm, with IPFire firewall providing HAProxy-based TLS termination and load balancing.

**Live Site**: [socket23.com](https://socket23.com) - Cybersecurity & IT Infrastructure Services

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

This infrastructure implements defense-in-depth security with multiple layers of protection:

### Container Security ⭐⭐⭐⭐⭐ (5/5)

- ✅ **Read-only filesystem** - Containers run with `read_only: true`
- ✅ **Non-root user** - NGINX runs as user 101:101 (unprivileged)
- ✅ **Minimal Alpine base** - Reduced attack surface
- ✅ **tmpfs mounts** - Writable directories in memory only (`/tmp`, `/run`, `/var/cache/nginx`)
- ✅ **No capabilities** - All Linux capabilities dropped
- ✅ **Health checks** - Automatic container recovery

### Network Security ⭐⭐⭐⭐⭐ (5/5)

- ✅ **Rate limiting** - 10 requests/second per IP, burst of 20
- ✅ **Request size limits** - 1MB max body size, prevents DoS
- ✅ **Host-mode publishing** - Deterministic routing on port 8080
- ✅ **HAProxy TLS termination** - Let's Encrypt certificates (external)
- ✅ **IPFire firewall** - Edge protection and access control (external)

### HTTP Security Headers ⭐⭐⭐⭐⭐ (5/5)

All responses include comprehensive security headers:

- ✅ **Content-Security-Policy** - Strict CSP with `'self'` only, form-action whitelist
- ✅ **Strict-Transport-Security** - HSTS with 1-year max-age and preload
- ✅ **X-Frame-Options** - `DENY` (prevents clickjacking)
- ✅ **X-Content-Type-Options** - `nosniff` (prevents MIME sniffing)
- ✅ **X-XSS-Protection** - `1; mode=block` (legacy XSS protection)
- ✅ **Referrer-Policy** - `strict-origin-when-cross-origin` (privacy)
- ✅ **Permissions-Policy** - Blocks geolocation, camera, microphone, payment, USB, sensors
- ✅ **Cross-Origin-Opener-Policy** - `same-origin` (process isolation)
- ✅ **Cross-Origin-Resource-Policy** - `same-origin` (resource isolation)
- ✅ **Cross-Origin-Embedder-Policy** - `require-corp` (embedding protection)
- ✅ **Server tokens hidden** - `server_tokens off` (hides NGINX version)

### Application Security ⭐⭐⭐⭐⭐ (5/5)

- ✅ **No backend code** - Pure static site (HTML/CSS/JS)
- ✅ **No database** - Zero SQL injection risk
- ✅ **No user authentication** - No session management vulnerabilities
- ✅ **Form via third-party** - Contact form uses Formsubmit.co
- ✅ **Input validation** - HTML5 required attributes
- ✅ **Honeypot spam protection** - Hidden field catches bots
- ✅ **URL parameter validation** - Prevents XSS via query strings
- ✅ **External links** - All use `rel="noopener noreferrer"` (prevents tabnabbing)

### Privacy ⭐⭐⭐⭐ (4/5)

- ✅ **No tracking scripts** - Zero analytics or third-party trackers
- ✅ **No cookies** - Completely stateless
- ✅ **No analytics** - No user behavior tracking
- ✅ **Strict referrer policy** - Minimal information leakage
- ⚠️ **Email in HTML source** - Contact email visible (acceptable for professional site)

### Attack Surface Analysis

| Attack Vector | Protection | Risk Level |
|---------------|------------|------------|
| **DoS/DDoS** | Rate limiting + IPFire firewall | 🟢 Low |
| **XSS** | Strict CSP + URL validation | 🟢 Low |
| **CSRF** | No state/sessions | 🟢 None |
| **SQL Injection** | No database | 🟢 None |
| **File Upload** | No upload capability | 🟢 None |
| **Container Escape** | Read-only + non-root | 🟢 Low |
| **Clickjacking** | X-Frame-Options: DENY | 🟢 None |
| **MITM** | HSTS + TLS (HAProxy) | 🟢 Low |
| **Email Harvesting** | Email in HTML | 🟡 Medium |
| **Spam** | Formsubmit + honeypot | 🟢 Low |

### Security Test Results

Test your deployment with these tools:

- **Mozilla Observatory**: [https://observatory.mozilla.org](https://observatory.mozilla.org/analyze/socket23.com) - Expected: A+ (100/100)
- **Security Headers**: [https://securityheaders.com](https://securityheaders.com/?q=socket23.com) - Expected: A+
- **SSL Labs**: [https://www.ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/analyze.html?d=socket23.com) - Expected: A+
- **CSP Evaluator**: [https://csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com/) - Expected: No high-severity issues

## 📁 Repository Structure

```text
.
├── README.md                                    # This file
├── DEPLOYMENT_GUIDE.md                          # Step-by-step deployment instructions
├── CONTACT_FORM_SETUP.md                        # Contact form activation guide
└── static-site/
    ├── Dockerfile                               # ARMv7 NGINX image
    ├── Makefile                                 # Build automation
    ├── nginx.conf                               # NGINX configuration with security headers
    ├── compose.yaml                             # Docker Compose (dev)
    ├── stack.yaml                               # Docker Stack (production)
    └── site/                                    # Static website content
        ├── index.html                           # Services page (main)
        ├── about.html                           # About page
        ├── projects.html                        # Projects showcase
        ├── contact.html                         # Contact form
        ├── 404.html                             # Error page
        ├── styles.css                           # Styling
        └── scripts.js                           # Client-side functionality
```

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+ with Swarm mode enabled
- ARMv7, ARM64, or AMD64 architecture
- (Optional) GitHub account for contact form setup

### 1. Initialize Docker Swarm

```bash
docker swarm init
```

### 2. Clone and Deploy

```bash
git clone https://github.com/socket23/site-infrastructure.git
cd site-infrastructure/static-site

# Build the image locally
docker build -t ghcr.io/socket23/static-site:latest .

# Deploy to Docker Swarm
docker stack deploy -c stack.yaml web
```

### 3. Verify Deployment

```bash
# Check service status
docker service ps web_web

# Test locally
curl -I http://localhost:8080/

# Check security headers
curl -I http://localhost:8080/ | grep -E "(Content-Security-Policy|Strict-Transport|X-Frame)"

# Test rate limiting (should see 503 after burst)
for i in {1..25}; do curl -I http://localhost:8080/ 2>&1 | grep HTTP; done
```

### 4. Activate Contact Form (Optional)

See [CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md) for detailed instructions.

**Quick activation**:

1. Visit your contact page
2. Submit the form once
3. Check your email for confirmation link
4. Click to activate

That's it! The site is now live with full security hardening.

## 📖 Key Concepts

### Host-Mode Publishing

- **Direct port binding** on `:8080` for deterministic routing
- Ensures traffic goes to the specific node where the service is running
- Required for single-node Swarm deployments with external load balancer

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
    target: /tmp
```

**Benefits**:

- Prevents malware persistence
- Protects against container escape attacks
- Ensures immutable infrastructure
- Forces proper configuration management

### Rate Limiting

NGINX rate limiting protects against DoS attacks and abuse:

```nginx
# Rate limiting zone - 10MB can track ~160k IP addresses
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

server {
    # Apply rate limiting globally
    limit_req zone=general burst=20 nodelay;
}
```

**Configuration**:

- **Rate**: 10 requests/second per IP
- **Burst**: 20 requests (allows legitimate traffic spikes)
- **Zone size**: 10MB (tracks ~160,000 unique IPs)
- **Mode**: `nodelay` (better user experience)

**What it protects against**:

- DoS/DDoS attacks
- Brute force attempts
- Web scraping abuse
- Resource exhaustion

### Request Size Limits

Prevents large upload DoS attacks:

```nginx
client_max_body_size 1m;           # Max 1MB request body
client_body_buffer_size 16k;       # 16KB buffer
client_header_buffer_size 1k;      # 1KB header buffer
large_client_header_buffers 4 8k;  # 4 buffers of 8KB each
```

### Content Security Policy (CSP)

Strict CSP prevents XSS and injection attacks:

```nginx
Content-Security-Policy:
  default-src 'self';
  img-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self';
  form-action 'self' https://formsubmit.co;
  connect-src 'self';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  upgrade-insecure-requests
```

**Key directives**:

- `default-src 'self'` - Only load resources from same origin
- `script-src 'self'` - Only execute scripts from same origin
- `form-action 'self' https://formsubmit.co` - Whitelist form submission endpoints
- `frame-ancestors 'none'` - Prevent clickjacking
- `upgrade-insecure-requests` - Force HTTPS for all resources

## 🛠️ Common Operations

### Update Website Content

```bash
# Pull latest changes
cd ~/site-infrastructure
git pull origin master

# Build new image
cd static-site
docker build -t ghcr.io/socket23/static-site:latest .

# Update service (zero-downtime with start-first strategy)
docker service update --image ghcr.io/socket23/static-site:latest web_web

# Verify update
docker service ps web_web
docker service logs -f web_web
```

### View Logs

```bash
# Follow logs in real-time
docker service logs -f web_web

# View last 100 lines
docker service logs --tail 100 web_web

# Filter for errors
docker service logs web_web 2>&1 | grep -i error
```

### Security Verification

```bash
# Check security headers
curl -I http://localhost:8080/ | grep -E "(Content-Security|X-Frame|Strict-Transport)"

# Verify CSP
curl -I http://localhost:8080/ | grep Content-Security-Policy

# Test rate limiting (should see 503 Service Unavailable after burst)
for i in {1..30}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/
done

# Check NGINX version is hidden
curl -I http://localhost:8080/ | grep -i server
# Should show "Server: nginx" without version number

# Verify read-only filesystem
docker exec $(docker ps -q -f name=web_web) touch /test
# Should fail with "Read-only file system"
```

### Health Check

```bash
# Service status
docker service ps web_web

# Container health
docker ps --filter name=web_web

# HTTP health check
curl -I http://localhost:8080/

# Detailed health status
docker inspect $(docker ps -q -f name=web_web) | grep -A 10 Health
```

### Performance Monitoring

```bash
# Resource usage
docker stats --no-stream

# Service details
docker service inspect web_web --pretty

# Network connections
docker exec $(docker ps -q -f name=web_web) netstat -tlnp
```

## 🐛 Troubleshooting

### Container Crashes with "Read-only file system"

**Problem**: Container exits with "Read-only file system" error

**Solution**: Add tmpfs mounts for directories NGINX needs to write to:

- `/var/cache/nginx`
- `/var/run`
- `/tmp`

**Verify tmpfs mounts**:

```bash
docker inspect $(docker ps -q -f name=web_web) | grep -A 5 Tmpfs
```

### Port Already in Use

**Problem**: Service fails with "port already in use on 1 node"

**Solution**: Remove old services and redeploy:

```bash
# List all services
docker service ls

# Remove old services
docker service rm web_web web-canary_web registry

# Wait for cleanup
sleep 10

# Verify port is free
docker ps --filter "publish=8080"

# Redeploy
docker stack deploy -c stack.yaml web
```

### Contact Form Not Working

**Problem**: Form submission fails or doesn't send email

**Solutions**:

1. **Check CSP allows form submission**:

```bash
curl -I http://localhost:8080/contact.html | grep Content-Security-Policy
# Should include: form-action 'self' https://formsubmit.co
```

2. **Activate Formsubmit** (first-time only):
   - Submit form once
   - Check email for confirmation
   - Click activation link

3. **Check browser console** for CSP violations

### Rate Limiting Too Aggressive

**Problem**: Legitimate users getting 503 errors

**Solution**: Adjust rate limiting in `nginx.conf`:

```nginx
# Increase rate or burst
limit_req_zone $binary_remote_addr zone=general:10m rate=20r/s;  # Was 10r/s
limit_req zone=general burst=50 nodelay;  # Was 20
```

### Security Headers Not Appearing

**Problem**: Security headers missing in responses

**Solution**: Check NGINX configuration and reload:

```bash
# Verify nginx.conf syntax
docker exec $(docker ps -q -f name=web_web) nginx -t

# Reload NGINX
docker service update --force web_web

# Test headers
curl -I http://localhost:8080/ | grep -E "(Content-Security|X-Frame|Strict-Transport)"
```

### External Access Not Working

**Problem**: Site not accessible from internet

**Solution**: Check IPFire firewall rules allow ports 80/443:

```bash
# On IPFire
iptables -C INPUT -i red0 -p tcp --dport 80 -j ACCEPT
iptables -C INPUT -i red0 -p tcp --dport 443 -j ACCEPT

# Check HAProxy is forwarding to Odroid
curl -I http://odroid-ip:8080/
```

### Image Pull Failures

**Problem**: Cannot pull image from GitHub Container Registry

**Solution**: Build locally or authenticate:

```bash
# Option 1: Build locally (recommended)
cd static-site
docker build -t ghcr.io/socket23/static-site:latest .

# Option 2: Authenticate to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u socket23 --password-stdin
docker stack deploy -c stack.yaml web
```

### High Memory Usage

**Problem**: Container using excessive memory

**Solution**: Check for memory leaks and add limits:

```bash
# Check current usage
docker stats --no-stream

# Add memory limits to stack.yaml
deploy:
  resources:
    limits:
      memory: 128M
    reservations:
      memory: 64M
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

## 📝 Security Changelog

### Version 2.0 (Current) - Security Hardened

**Date**: 2025-11-02

**Major Security Enhancements**:

- ✅ Added NGINX rate limiting (10 req/s per IP, burst 20)
- ✅ Added request size limits (1MB max body, prevents DoS)
- ✅ Enhanced CSP with `form-action` whitelist for contact form
- ✅ Added explicit `script-src` and `connect-src` directives
- ✅ Improved Referrer-Policy to `strict-origin-when-cross-origin`
- ✅ Enhanced Permissions-Policy (added payment, USB, sensors)
- ✅ Increased HSTS to 1 year with preload directive
- ✅ Added X-XSS-Protection header
- ✅ Hidden NGINX version (`server_tokens off`)
- ✅ Added URL parameter validation in JavaScript
- ✅ Implemented contact form with Formsubmit.co
- ✅ Added honeypot spam protection

**Site Updates**:

- ✅ Professional cybersecurity & IT services portfolio
- ✅ Four-page site: Services, About, Projects, Contact
- ✅ Responsive design with mobile navigation
- ✅ Contact form with success message handling

**Security Score**: ⭐⭐⭐⭐⭐ (5/5) - Production Ready

### Version 1.0 - Initial Release

**Date**: 2025-10-XX

**Features**:

- ✅ Read-only containers with tmpfs mounts
- ✅ Unprivileged NGINX (user 101:101)
- ✅ Basic security headers (CSP, HSTS, X-Frame-Options)
- ✅ Docker Swarm deployment
- ✅ HAProxy TLS termination
- ✅ Health checks

## 📝 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

This is a personal infrastructure project. Feel free to fork and adapt for your own use.

**Security contributions welcome**! If you find a security issue, please:

1. **Do not** open a public issue
2. Email: [Millerjo4582@gmail.com](mailto:Millerjo4582@gmail.com)
3. Include: Description, impact, reproduction steps
4. Allow 48 hours for response

## 📧 Contact

- **Website**: [socket23.com](https://socket23.com)
- **Email**: [Millerjo4582@gmail.com](mailto:Millerjo4582@gmail.com)
- **GitHub**: [@socket23](https://github.com/socket23)
- **LinkedIn**: [Joseph Miller](https://www.linkedin.com/in/joseph-m-023631360/)
- **Location**: Sandy, Oregon (PST)

## 🔗 Related Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md) - Contact form activation guide
- [static-site/nginx.conf](static-site/nginx.conf) - NGINX security configuration
- [static-site/stack.yaml](static-site/stack.yaml) - Docker Swarm deployment config

## 🎯 Use Cases

This infrastructure is ideal for:

- ✅ **Personal/Professional websites** - Portfolio, resume, business card sites
- ✅ **Security-focused deployments** - When security is the top priority
- ✅ **Edge computing** - Low-power ARM devices (Raspberry Pi, Odroid, etc.)
- ✅ **Learning** - Understanding Docker Swarm, NGINX, security headers
- ✅ **Static site hosting** - No backend, no database, pure HTML/CSS/JS
- ✅ **Homelab projects** - Self-hosted infrastructure

## 🚀 Future Enhancements

Potential improvements (not currently planned):

- [ ] Automated security scanning in CI/CD
- [ ] Prometheus metrics export
- [ ] Automated certificate renewal monitoring
- [ ] Multi-node Swarm deployment guide
- [ ] Ansible playbooks for automated deployment
- [ ] Terraform configuration for cloud deployment

---

## 💡 Philosophy

**Built with ❤️ for secure, reproducible infrastructure**

**Security First. Always.**
