# Backend da Gideão — guia técnico

Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage) + Vercel. Não existe um servidor
separado: o "backend" são o banco com regras de segurança (RLS), as *server actions* do painel
admin e algumas rotas em `src/app/api`.

## Mapa

| Parte | Onde | Para quê |
|---|---|---|
| Banco | Supabase (`supabase/migrations/`) | Catálogo, pedidos, banners, perfis, eventos de visita |
| Acesso ao banco | `src/lib/supabase/` | Clientes tipados: navegador, servidor (com cookies) e público (sem cookies, para páginas em cache) |
| Tipos do banco | `src/lib/supabase/database.types.ts` | Gerado do schema; o TypeScript acusa coluna errada |
| Painel admin | `src/app/admin/*` | Pedidos, produtos, banners e análise (só `profiles.role = 'admin'`) |
| Ações do admin | `src/app/admin/actions.ts` | Gravam no banco; validam com `src/lib/admin-validation.ts` |
| Busca | `src/app/api/search/route.ts` | Procura no catálogo inteiro; a página inicial não baixa o catálogo |
| Eventos de visita | `src/lib/events.ts` → `site_events` | Anônimo: ver produto, adicionar, buscar, WhatsApp |
| Meta (API de Conversões) | `src/app/api/meta-event/route.ts` | Envia o Lead pelo servidor (precisa de `META_CAPI_TOKEN`) |
| Saúde | `GET /api/health` | `ok` ou `degraded` (para monitor de disponibilidade) |
| Login de clientes | `src/app/conta/*`, `src/app/auth/callback` | Cadastro, entrar, esqueci a senha |

## Segurança (como está protegido)

- **RLS em todas as tabelas.** O público só lê produtos e banners ativos. Pedidos e eventos o
  público só consegue **criar** (e só no formato válido); ler/alterar é só admin.
- **Admin = `profiles.role = 'admin'`**, checado em três camadas: middleware, `requireAdmin()` nas
  ações/páginas e RLS no banco (`private.is_admin()`, fora do schema exposto pela API).
- **Fotos e vídeos** (`storage: product-media`): leitura pública, escrita só admin.
- **Validação dupla:** `zod` nas ações do admin e `CHECK` constraints no banco (preço ≥ 0, status
  de pedido, tamanhos, slug...). O banco recusa dado inválido mesmo que o código erre.
- **Segredos:** só em variáveis de ambiente da Vercel (veja `.env.example`). A chave pública
  `anon` pode ficar no navegador; `META_CAPI_TOKEN` jamais.
- **Pendente no painel do Supabase (não dá por código):** *Authentication → Providers → Email →
  Leaked password protection* (exige plano Pro) e SMTP próprio para e-mails.

## Mudando o banco

1. Escreva uma migração SQL em `supabase/migrations/AAAAMMDDHHMMSS_nome.sql` e aplique no Supabase
   (SQL Editor ou `supabase db push`).
2. Rode o **Advisors** (Supabase → Advisors) e corrija avisos de segurança.
3. Regenere os tipos: `supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts`.
4. `npm run typecheck && npm test`.

O histórico anterior a outubro/2026 está na tabela de migrações do próprio Supabase; os arquivos
desta pasta contêm as alterações feitas a partir daí.

## Rotina de desenvolvimento

```
npm run dev        # site local (usa o Supabase do .env.local)
npm run lint
npm run typecheck
npm test           # busca e validações
npm run build
```

O GitHub Actions (`.github/workflows/ci.yml`) roda lint, tipos, testes e build a cada push.

## Limpeza de dados

Eventos de visita antigos podem ser apagados no SQL Editor:
`select private.purge_old_site_events(180);` (mantém os últimos 180 dias).
