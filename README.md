# LabSafe - Front-End

Parte visual do LabSafe, um sistema de treinamento em segurança nos laboratórios desenvolvido como projeto acadêmico de Engenharia de Software.

## Objetivo

Apoiar o aprendizado de práticas de segurança nos laboratórios por meio de conteúdos educativos, quizzes e acompanhamento do desempenho dos alunos.

## Funcionalidades

O sistema possui três perfis de acesso:

| Perfil | O que pode fazer |
| --- | --- |
| Administrador | Cadastrar e editar usuários, reenviar convites, desativar ou reativar contas e consultar os totais de usuários. |
| Professor | Consultar conteúdos e quizzes, criar e gerenciar seus próprios materiais e acompanhar o desempenho dos alunos. |
| Aluno | Consultar conteúdos, responder quizzes, visualizar seus resultados e pesquisar compostos químicos. |

Também estão disponíveis:

- Criação de senha por convite enviado por e-mail.
- Recuperação de senha e solicitação de um novo link.
- Consulta do próprio perfil.
- Exclusão da própria conta para professores e alunos.
- Termos de Uso e Política de Privacidade.

Nos quizzes, a aprovação exige pelo menos **60% de acertos**. Após a aprovação, o aluno não pode responder novamente ao mesmo quiz.

Na página **Compostos**, digite o nome do composto em **inglês**. As informações são consultadas no PubChem.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- React Router DOM
- React Hook Form e Zod
- Recharts

## Antes de começar

Tenha instalado:

- Git.
- Node.js 24 com npm.

O [backend do LabSafe](https://github.com/goncalvesjv2/labsafe-backend) também precisa estar configurado e em execução. Siga as instruções do README daquele projeto para iniciá-lo.

## Como executar o projeto

### 1. Baixar o projeto

Abra o terminal e execute:

```bash
git clone https://github.com/goncalvesjv2/labsafe-frontend.git
```

### 2. Acessar o projeto

```bash
cd labsafe-frontend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar a conexão com o backend

Na pasta principal do projeto, junto ao `README.md`, crie um arquivo chamado `.env`.

Coloque nele o endereço do backend. Por exemplo, se ele estiver em `http://localhost:3000`:

```env
VITE_API_URL=http://localhost:3000
```

Se o backend estiver em outro endereço ou porta, ajuste esse valor.

### 5. Iniciar o projeto

Com o backend em execução, rode:

```bash
npm run dev
```

### 6. Abrir no navegador

Acesse **http://localhost:5173**. Esse endereço deve corresponder ao permitido na configuração do backend.

Mantenha os terminais do frontend e do backend abertos enquanto estiver usando o sistema. Para encerrar cada um, pressione `Ctrl + C` no terminal correspondente.

Nas próximas vezes, basta iniciar o backend, abrir um terminal na pasta `labsafe-frontend` e executar `npm run dev`.

## Primeiro acesso

1. Solicite seu cadastro a um administrador. Para o primeiro acesso como administrador, solicite uma conta ao responsável pelo projeto.
2. Abra o convite recebido por e-mail e crie sua senha. O convite é válido por **5 minutos**; se expirar, solicite um novo ao administrador.
3. Na tela de login, informe seu e-mail e sua senha, leia os Termos de Uso e a Política de Privacidade e marque a opção de aceite para entrar.

Se já tiver uma senha e precisar recuperá-la, utilize **Esqueci minha senha**. O link recebido por e-mail também é válido por **5 minutos**. Se expirar, utilize **Solicitar um novo link** ou faça o pedido novamente na tela de recuperação.

## Outros comandos

Execute os comandos dentro da pasta do projeto:

| Comando | Para que serve |
| --- | --- |
| `npm run lint` | Verificar problemas no código. |
| `npm run build` | Gerar a versão do projeto para publicação. |
| `npm run preview` | Visualizar a versão gerada pelo comando anterior. |

## Dificuldades comuns

- **O sistema não carrega os dados:** confira se o backend está em execução e se o endereço no `.env` está correto.
- **Você alterou o `.env`:** encerre o frontend com `Ctrl + C` e execute `npm run dev` novamente.
- **O e-mail cadastrado está incorreto:** solicite a correção ao administrador. Se ainda não criou a senha, ele deverá salvar o novo endereço e reenviar o convite.

## Contato

Responsável pelo projeto: [joaogoncalves3m@gmail.com](mailto:joaogoncalves3m@gmail.com).
