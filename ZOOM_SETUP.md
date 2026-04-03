# Guia de Configuração da API do Zoom (Server-to-Server OAuth)

Para que o app consiga criar as sessões de terapia automaticamente, você precisa configurar um App no Zoom Marketplace.

## Passo 1: Criar o App no Zoom Marketplace
1. Acesse o [Zoom App Marketplace](https://marketplace.zoom.us/).
2. Faça login com sua conta Zoom (Plano Pro ou superior é necessário para algumas funcionalidades).
3. No menu superior direito, clique em **Develop** > **Build App**.
4. Escolha o tipo **Server-to-Server OAuth** e clique em **Create**.
5. Dê um nome ao app (ex: `EvoluaEla-Backend`) e clique em **Create**.

## Passo 2: Obter as Credenciais
1. Na aba **App Credentials**, você encontrará:
   - **Client ID**
   - **Client Secret**
   - **Account ID**
2. Copie esses valores e cole no seu arquivo `.env` do projeto:
   ```env
   ZOOM_CLIENT_ID="seu_client_id"
   ZOOM_CLIENT_SECRET="seu_client_secret"
   ZOOM_ACCOUNT_ID="seu_account_id"
   ```

## Passo 3: Configurar Scopes (Permissões)
1. Na aba **Scopes**, clique em **Add Scopes**.
2. Adicione as seguintes permissões:
   - **Meeting**: `meeting:write:admin`, `meeting:read:admin`
   - **User**: `user:read:admin`
   - **Recording**: `recording:read:admin` (opcional, para replays automáticos)
3. Clique em **Done**.

## Passo 4: Ativar o App
1. Na aba **Activation**, clique em **Activate your app**.

---

## Próximos Passos no App
- O backend agora tentará criar as sessões automaticamente a cada 15 dias (1º e 15º do mês às 20h).
- Você pode forçar a criação inicial reiniciando o servidor.
- As gravações serão salvas na nuvem do Zoom (se configurado no plano Pro) e o link será atualizado no banco de dados.

## Dicas de Teste
- O botão "Entrar na Sala" só ficará ativo 10 minutos antes do horário agendado.
- Certifique-se de que o usuário tem o status `is_premium = true` ou `acesso_terapia_grupo = true` no Supabase.
