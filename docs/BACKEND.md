# Backend da Gideão — guia técnico

Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage) + Vercel. Não existe um servidor
separado: o backend é organizado em **camadas** dentro do mesmo projeto, com regras que o lint
faz cumprir (`eslint.config.mjs`).

## Camadas (de dentro para fora)

```
src/
├─ domain/        REGRAS E TIPOS PUROS. Não sabem de banco, React ou Next.
│  ├─ product.ts      produto do catálogo
│  ├─ banner.ts       banners da página inicial
│  ├─ order.ts        status do pedido + validação do orçamento (zod)
│  ├─ events.ts       eventos de visita (análise)
│  ├─ money.ts        preço: "1.234,50" ⇄ número
│  └─ search.ts       busca no catálogo (nome, detalhe, departamento, medidas)
│
├─ server/        TUDO QUE FALA COM BANCO E SERVIÇOS. Só roda no servidor ("server-only").
│  ├─ config/         env.ts — variáveis de ambiente validadas (lista os NOMES errados, nunca os valores)
│  ├─ db/             clientes Supabase do servidor: session (com cookies) e public (anônimo, p/ cache)
│  ├─ auth/           admin.ts (requireAdmin) e middleware.ts (sessão + proteção do /admin)
│  ├─ catalog/        products.repository.ts (leitura), catalog.service.ts (cache + busca), fallback-products.ts
│  ├─ banners/        banners.repository.ts
│  ├─ orders/         orders.service.ts — grava o orçamento e REPRECIFICA os itens pelo catálogo
│  ├─ analytics/      analytics.repository.ts — funil de visitas, produtos e buscas (só admin)
│  ├─ marketing/      meta-capi.ts — API de Conversões da Meta (evento Lead pelo servidor)
│  ├─ admin/          validation.ts — validação (zod) dos formulários do painel
│  ├─ http/           errors.ts (AppError e filhas), handler.ts (apiHandler, parseJson), rate-limit.ts
│  └─ observability/  logger.ts — logs em JSON, com credenciais ocultadas
│
├─ app/           TRANSPORTE (fino): páginas, rotas /api e server actions. Só chamam o `server/`.
│  ├─ api/search · api/orders · api/meta-event · api/health
│  ├─ admin/          painel (pedidos, produtos, banners, análise) e suas actions
│  └─ conta/ · auth/  login, cadastro, recuperação de senha
│
├─ components/    INTERFACE (navegador).
├─ lib/           utilitários do navegador: carrinho, eventos, rastreio, cliente Supabase do navegador.
├─ config/        site.ts — dados da loja (telefone, endereço, departamentos).
└─ test/          apoio dos testes.
```

**Regra de dependência:** `domain` ← `server` ← `app`. O navegador (`components`, `lib`) nunca
importa `server`, e o `domain` não importa nada de fora dele. O `eslint` bloqueia o contrário.

## Endpoints

| Rota              | Método   | O que faz                                  | Proteções                                                                    |
| ----------------- | -------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| `/api/search?q=`  | GET      | Busca no catálogo inteiro                  | limite de 120/min por IP, cache de 5 min                                     |
| `/api/orders`     | POST     | Registra o orçamento enviado pelo carrinho | só mesma origem, 10/min por IP, validação zod, preços refeitos pelo catálogo |
| `/api/meta-event` | GET/POST | Estado / envio do Lead à Meta              | só mesma origem, 30/min por IP, só eventos permitidos                        |
| `/api/health`     | GET      | Saúde: configuração e banco                | não expõe dados                                                              |

Todas usam `apiHandler`: erro esperado → resposta com `status`, `code` e mensagem; bug → log
completo no servidor e resposta genérica (nunca vaza detalhe).

## Banco de dados e segurança

- **RLS em todas as tabelas.** O público só lê produtos e banners ativos. Pedidos e eventos o
  público só consegue **criar** (e só no formato válido); ler/alterar é só admin.
- **Admin = `profiles.role = 'admin'`**, checado em três camadas: middleware, `requireAdmin()` e RLS
  (`private.is_admin()`, em schema não exposto pela API).
- **Painel admin por categorias:** produtos por departamento (visão geral, filtros e busca), pedidos por andamento e banners por posição.
- **Storage `product-media`:** leitura pública, escrita só admin.
- **Validação em duas camadas:** `zod` no servidor e `CHECK` constraints no banco (preço ≥ 0,
  status do pedido, tamanhos, formato do slug...).
- **Segredos:** só em variáveis de ambiente da Vercel (`.env.example`). `META_CAPI_TOKEN` nunca no
  código. Os logs ocultam qualquer campo chamado token/secret/password/etc.
- **Pendente no painel do Supabase (não dá por código):** _Leaked password protection_ (plano Pro)
  e SMTP próprio para e-mails.

## Mudando o banco

1. Crie `supabase/migrations/AAAAMMDDHHMMSS_nome.sql` e aplique no Supabase (SQL Editor ou
   `supabase db push`).
2. Rode **Advisors** (Supabase) e corrija avisos de segurança.
3. Regenere os tipos: `supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts`.
4. `npm run typecheck && npm test`.

## Acrescentando um recurso novo

1. Tipos e regras puras em `src/domain/`.
2. Acesso ao banco em `src/server/<recurso>/<recurso>.repository.ts`; regras em `.service.ts`.
3. Rota em `src/app/api/<recurso>/route.ts` usando `apiHandler`, `parseJson` e `createRateLimiter`.
4. Testes ao lado do código (`*.test.ts`).

## Rotina

```
npm run dev | lint | typecheck | test | build
```

O GitHub Actions (`.github/workflows/ci.yml`) roda lint, tipos, testes e build a cada push.

## Limpeza de dados

Eventos antigos de visita: `select private.purge_old_site_events(180);` no SQL Editor (mantém 180 dias).
