# SGM La Parada — Frontend

Next.js 14 + TypeScript + Tailwind. Consume el backend Express vía
`NEXT_PUBLIC_API_URL`.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

## Despliegue

Vercel free tier. Variables:
- `NEXT_PUBLIC_API_URL=https://<tu-backend>.onrender.com/api`
