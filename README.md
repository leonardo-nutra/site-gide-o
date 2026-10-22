# Gideão Atacadão da Construção — site e painel

Loja online com catálogo por departamento, orçamento pelo WhatsApp, login de clientes e painel
administrativo. Mesquita-RJ · <https://site-gide-o.vercel.app>

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase
(Postgres, Auth, Storage) · Vercel

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (inclui o schema do banco) |
| `npm test` | Testes (busca e validações do admin) |
| `npm run build` | Build de produção |

O GitHub Actions roda lint, tipos, testes e build a cada push (`.github/workflows/ci.yml`).
Todo push na `master` é publicado automaticamente na Vercel.

## Estrutura

```
src/app/              páginas (site, /conta, /admin) e rotas /api
src/components/       interface (cards, carrinho, filtros, admin)
src/domain/           regras e tipos puros (produto, pedido, busca, preço)
src/server/           banco, serviços e integrações (só servidor)
src/lib/              utilitários do navegador (carrinho, eventos, rastreio)
supabase/migrations/  mudanças do banco (a partir de out/2026)
supabase/email-templates/  e-mails de cadastro e senha em português
docs/BACKEND.md       guia técnico do backend e da segurança
```

## Painel admin

`/admin` (somente usuários com `profiles.role = 'admin'`): pedidos recebidos, produtos (preço,
foto, ofertas), banners e **Análise** (visitas, produtos vistos, buscas, cliques no WhatsApp).

Veja [docs/BACKEND.md](docs/BACKEND.md) para o desenho do backend, as regras de segurança e como
alterar o banco.
