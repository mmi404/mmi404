# Deploying mmi404.com on the shared VPS

The VPS runs several unrelated live sites behind ONE shared Caddy
(`shared_proxy_caddy`, config in `/opt/shared-proxy/`). This stack never
publishes host ports and never touches other sites' containers. Containers:
`mmi404_mysql`, `mmi404_backend` (both private), `mmi404_frontend` (also on the
external `edge` network, which is how Caddy reaches it).

## 1. Create the secrets file (once)

```bash
cd /root/mmi404
cp docker/.env.prod.example docker/.env.prod && chmod 600 docker/.env.prod
openssl rand -base64 24 | tr -d '/+='      # -> DB_PASSWORD
openssl rand -base64 24 | tr -d '/+='      # -> DB_ROOT_PASSWORD
openssl rand -base64 48 | tr -d '\n'       # -> JWT_SECRET (needs >= 32 bytes)
nano docker/.env.prod                      # paste those + pick ADMIN_USERNAME / a strong ADMIN_PASSWORD
```

`docker/.env.prod` is gitignored. Do not use the dev values (`admin` /
`dev-only-change-me`).

## 2. Start MySQL only, then load the real content

```bash
docker compose --env-file docker/.env.prod -f docker/docker-compose.prod.yml up -d --build mysql
docker compose --env-file docker/.env.prod -f docker/docker-compose.prod.yml ps   # wait for healthy

set -a; . docker/.env.prod; set +a
docker exec -i mmi404_mysql mysql -u mmi404 -p"$DB_PASSWORD" portfolio < plan/portfolio-data-dump.sql

# The dump carries the DEV admin account and a test message. Remove them so the
# real admin is created from ADMIN_USERNAME/ADMIN_PASSWORD on first backend boot.
docker exec mmi404_mysql mysql -u mmi404 -p"$DB_PASSWORD" portfolio \
  -e "DELETE FROM admin_user; DELETE FROM contact_message;"
```

## 3. Start backend + frontend, restore screenshots

```bash
docker compose --env-file docker/.env.prod -f docker/docker-compose.prod.yml up -d --build
docker run --rm -v mmi404_mmi404_uploads:/data -v "$PWD/plan:/backup:ro" alpine \
  sh -c 'tar xzf /backup/uploads-backup.tar.gz -C /data && chmod -R a+rX /data'
docker compose --env-file docker/.env.prod -f docker/docker-compose.prod.yml restart backend
```

(Compose prefixes the project name `mmi404`, so the real volumes are `mmi404_mmi404_mysql_data` and
`mmi404_mmi404_uploads`. Restoring into any other volume name silently does nothing.)

## 4. Route traffic (shared Caddy)

Append `docker/caddy/mmi404.Caddyfile` to `/opt/shared-proxy/Caddyfile`, then:

```bash
cp /opt/shared-proxy/Caddyfile /opt/shared-proxy/Caddyfile.bak-$(date +%F)
docker exec shared_proxy_caddy caddy validate --config /etc/caddy/Caddyfile
docker exec shared_proxy_caddy caddy reload   --config /etc/caddy/Caddyfile
```

Only reload after `validate` prints "Valid configuration"; a reload with a bad
file would affect every site on the box.

## 5. Verify

```bash
curl -s https://mmi404.com | grep -c "Screenshot coming soon"   # 0
curl -sI https://mmi404.com | head -3        # 200, valid cert
curl -sI https://www.mmi404.com | head -3    # 301 -> https://mmi404.com
```
Then log in at https://mmi404.com/admin with the NEW admin credentials, and
confirm the old `admin` / `dev-only-change-me` no longer works.
