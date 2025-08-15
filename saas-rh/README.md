## Requisitos
- Node 20, pnpm/npm
- Supabase project (URL + anon + service key)
- Redis para BullMQ (redis://) y Upstash Redis (REST) para rate-limit

## Env vars
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (solo en worker)
- SUPABASE_DB_URL (postgres:// para migraciones, opcional)
- REDIS_URL, REDIS_TOKEN (Upstash REST para rate limit)
- BULL_REDIS_URL (redis:// para BullMQ queues/workers)

## Dev
npm i
npm run dev # web y worker en paralelo con turbo si preferís

## Prod
npm run build && npm -w apps/web start
node apps/worker/dist/index.js

## Seguridad
- 0 endpoints públicos usando service role
- Rate limit Redis activo en /api/attendance (Upstash REST)
- Uploads solo vía pre-signed a bucket `vouchers`
- CI con lint/typecheck/build en PR
- Índice RIGHT(dni,5) y UNIQUE(employee_id, work_date)
- Logs con redacción de PII

## Próximos pasos
- Implementar PDF (pdfkit) en worker
- Añadir observabilidad (OpenTelemetry/Prometheus/Grafana o proveedor gestionado)
- Completar RPC create_attendance con validaciones e idempotencia