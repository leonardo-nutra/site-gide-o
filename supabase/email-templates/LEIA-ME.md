# E-mails da loja em português (Supabase)

O Supabase manda os e-mails de cadastro e de troca de senha. Por padrão eles vêm em
inglês e sem a marca da loja. Estes modelos já estão em português, com o logo, as cores,
o endereço e o telefone da Gideão.

Os modelos precisam ser colados no painel do Supabase (isso não dá para fazer pelo site):

1. Abra o projeto no Supabase → **Authentication** → **Emails** (ou **Email Templates**).
2. Para cada modelo da tabela abaixo: abra a aba com o nome em inglês, troque o **Subject**
   (assunto) e cole o conteúdo do arquivo no campo **Message body** (HTML). Salve.

| Aba no Supabase | Assunto | Arquivo |
|---|---|---|
| Reset Password | Crie uma nova senha – Gideão Atacadão da Construção | `recuperar-senha.html` |
| Confirm sign up | Confirme seu cadastro – Gideão Atacadão da Construção | `confirmar-cadastro.html` |
| Change Email Address | Confirme seu novo e-mail – Gideão Atacadão da Construção | `trocar-email.html` |

3. Em **Authentication** → **URL Configuration**:
   - **Site URL**: `https://site-gide-o.vercel.app`
   - **Redirect URLs**: adicione `https://site-gide-o.vercel.app/**`

   Sem isso o link do e-mail pode abrir a página errada.

## Remetente ("Supabase Auth")

O nome e o endereço de quem envia ("Supabase Auth <noreply@mail.app.supabase.io>") só mudam
com um servidor de e-mail próprio (SMTP), em **Authentication** → **SMTP Settings**.
Um servidor próprio também tira o limite de poucos e-mails por hora do envio padrão.
Serviços como Resend ou Brevo têm plano gratuito. É preciso um endereço de e-mail da loja
(por exemplo, nao-responda@seudominio.com.br).
