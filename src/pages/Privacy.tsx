import DocumentLayout from "../components/DocumentLayout";
import DocumentSection from "../components/DocumentSection";

function Privacy() {
    return (
        <DocumentLayout title="Política de Privacidade" className="mt-4">
            <DocumentSection title="1. Quem é responsável pelos dados">
                <p>O LabSafe é uma plataforma desenvolvida como projeto acadêmico do curso de Engenharia de Software, com o objetivo de oferecer treinamento e capacitação em segurança laboratorial.</p>
                <p>Nesta versão acadêmica, o responsável pelo projeto LabSafe também responde pelo tratamento dos dados pessoais utilizados para o funcionamento da plataforma e pode ser contatado pelo e-mail <a href="mailto:joaogoncalves3m@gmail.com" className="text-primary underline [overflow-wrap:anywhere]">joaogoncalves3m@gmail.com</a>.</p>
                <p>Em uma futura utilização do sistema em uma instituição de ensino, empresa ou outra organização, a responsabilidade pelo tratamento dos dados deverá ser definida de acordo com a organização responsável pela utilização da plataforma.</p>
                <p>Para dúvidas ou solicitações relacionadas ao tratamento de dados pessoais, o usuário poderá utilizar o canal de contato informado na seção <strong>9. Contato</strong>.</p>
            </DocumentSection>
            <DocumentSection title="2. Quais dados coletamos" contentClassName="mt-4">
                <p>O cadastro é realizado por um administrador, que informa o nome, o e-mail e o perfil de acesso do usuário. O usuário define sua própria senha por meio de um convite enviado ao e-mail cadastrado.</p>
                <p className="mb-2">Para o funcionamento da plataforma, o LabSafe utiliza os seguintes dados pessoais:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li><strong>Nome:</strong> utilizado para identificar o usuário dentro da plataforma.</li>
                    <li><strong>E-mail:</strong> utilizado para identificar a conta, realizar a autenticação e enviar convites de criação de senha e mensagens de recuperação de acesso.</li>
                    <li><strong>Senha:</strong> utilizada para realizar a autenticação e permitir o acesso à conta. A senha não é armazenada em texto simples, sendo armazenada em formato de hash.</li>
                    <li><strong>Perfil:</strong> utilizado para definir a função do usuário na plataforma e determinar quais funcionalidades e recursos ele pode acessar. Os perfis disponíveis são Admin, Professor(a) e Aluno(a).</li>
                    <li><strong>Situação da conta:</strong> indica se o cadastro está ativo ou desativado.</li>
                    <li><strong>Dados de treinamento:</strong> incluem as respostas enviadas aos quizzes, as tentativas realizadas, as notas, a situação de aprovação e as datas e horários das tentativas, vinculados ao aluno e ao quiz correspondente.</li>
                    <li><strong>Autoria de conteúdos e quizzes:</strong> identifica o professor responsável pelos materiais cadastrados na plataforma.</li>
                    <li><strong>Registros de auditoria:</strong> contêm a descrição do evento, a ação realizada e o identificador do usuário associado. São utilizados para acompanhar acontecimentos relevantes, como autenticação, cadastro, alteração de dados e tentativas de acesso sem autorização. A descrição pode incluir dados relacionados à ação, como o e-mail de um cadastro alterado.</li>
                </ul>
            </DocumentSection>
            <DocumentSection title="3. Por que usamos seus dados" contentClassName="mt-4">
                <p>Os dados pessoais utilizados pelo LabSafe são necessários para permitir o funcionamento da plataforma e suas principais funcionalidades.</p>
                <p>Os dados são utilizados para:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>Cadastrar e identificar o usuário na plataforma.</li>
                    <li>Realizar a autenticação e o login, permitindo que o usuário acesse sua conta.</li>
                    <li>Enviar convites para criação de senha e permitir a recuperação de acesso por e-mail.</li>
                    <li>Definir o perfil e as permissões de acesso, permitindo que cada usuário tenha acesso às funcionalidades e conteúdos correspondentes à sua função.</li>
                    <li>Registrar as respostas dos alunos, calcular os resultados dos quizzes e permitir o acompanhamento das tentativas e da situação de aprovação.</li>
                    <li>Permitir que professores acompanhem o desempenho dos alunos nos quizzes de sua autoria e identifiquem os materiais que cadastraram.</li>
                    <li>Registrar acontecimentos e ações relevantes do sistema, por meio dos registros de auditoria, contribuindo para o acompanhamento e a segurança da plataforma.</li>
                </ul>
                <p>O aluno pode consultar seus próprios resultados. Professores podem consultar o nome dos alunos, a quantidade de tentativas e os resultados dos quizzes de sua autoria. Administradores têm acesso às funcionalidades de gerenciamento dos dados cadastrais dos usuários.</p>
                <p>Se o e-mail cadastrado estiver incorreto, o usuário poderá solicitar a correção ao administrador ou pelo canal da seção <strong>9. Contato</strong>. A alteração do e-mail invalida os links anteriores de convite e recuperação de senha. Para contas que ainda não definiram uma senha, o administrador deverá reenviar o convite ao endereço corrigido; esse envio não ocorre automaticamente ao salvar a alteração.</p>
                <p>Dessa forma, o tratamento dos dados permite que o LabSafe cadastre os usuários, controle o acesso à plataforma e disponibilize os conteúdos de acordo com o perfil de cada usuário.</p>
            </DocumentSection>
            <DocumentSection title="4. Serviços externos e compartilhamento" contentClassName="mt-4">
                <p>O LabSafe utiliza o PubChem como serviço externo para permitir a consulta de informações sobre compostos químicos. Na página Compostos, o usuário é orientado a informar o nome do composto em inglês.</p>
                <p>Quando o usuário realiza uma consulta, o LabSafe encaminha ao PubChem o nome do composto pesquisado para obter informações como:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>CID;</li>
                    <li>Nome do composto;</li>
                    <li>Fórmula molecular;</li>
                    <li>Peso molecular;</li>
                </ul>
                <p>A consulta de compostos não envia ao PubChem os dados cadastrais do usuário, como nome, e-mail, senha ou perfil de acesso.</p>
                <p>As informações retornadas pelo PubChem são utilizadas pelo LabSafe apenas para apresentar os dados do composto consultado ao usuário.</p>
                <p>Os convites de criação de senha e os links solicitados pela opção <strong>Esqueci minha senha</strong> são enviados pelo Gmail, serviço de e-mail do Google. O Gmail também é utilizado para enviar um novo link de recuperação quando o usuário solicita sua substituição, inclusive após a expiração do anterior. Para realizar a entrega, esse serviço processa o endereço do destinatário e o conteúdo da mensagem. Os convites incluem o nome do usuário e um link para criação de senha. A senha definida pelo usuário não é incluída nessas mensagens.</p>
                <p>O link de recuperação de senha é válido por <strong>5 minutos a partir de sua geração</strong>. Se o link expirar ou já tiver sido utilizado, o usuário poderá acessar <strong>Esqueci minha senha</strong> ou a opção <strong>Solicitar um novo link</strong> na página de redefinição e informar seu e-mail cadastrado para solicitar outra mensagem.</p>
            </DocumentSection>
            <DocumentSection title="5. Armazenamento no navegador" contentClassName="mt-4">
                <p>O LabSafe utiliza o sessionStorage do navegador para armazenar o token de autenticação durante a sessão da aba, mantendo o acesso do usuário à plataforma ao recarregar a página.</p>
                <p>Quando o usuário clica em sair ou conclui a exclusão da própria conta, o token armazenado no sessionStorage é removido, encerrando a sessão naquela aba.</p>
                <p>O LabSafe não utiliza cookies para armazenar o token de autenticação.</p>
            </DocumentSection>
            <DocumentSection title="6. Armazenamento no banco de dados e exclusão da conta" contentClassName="mt-4">
                <p>Os dados cadastrais são armazenados no banco de dados do LabSafe enquanto a conta estiver cadastrada na plataforma. A desativação de uma conta pelo administrador mantém seu cadastro armazenado.</p>
                <p>As senhas são armazenadas em formato de hash, não sendo mantidas em texto simples.</p>
                <p>Professores e alunos podem excluir a própria conta na página Perfil, pelo botão <strong>Excluir minha conta</strong>. Antes do envio do pedido, a plataforma apresenta um diálogo de confirmação.</p>
                <p>Após a confirmação e a conclusão da operação, o cadastro do usuário e os dados vinculados à conta são removidos do banco de dados. Essa remoção inclui as respostas e tentativas do usuário, os conteúdos e quizzes de sua autoria e os registros de auditoria vinculados à conta. A sessão utilizada para realizar a exclusão é encerrada. A exclusão é definitiva e não pode ser desfeita pela interface.</p>
                <p>A exclusão da própria conta pela página Perfil não está disponível para administradores. Solicitações relacionadas aos seus dados pessoais podem ser encaminhadas pelo canal informado na seção <strong>9. Contato</strong>.</p>
            </DocumentSection>
            <DocumentSection title="7. Seus direitos" contentClassName="mt-4">
                <p>O usuário poderá encaminhar solicitações sobre seus dados pessoais pelo canal informado na seção <strong>9. Contato</strong>, inclusive quando o pedido não estiver disponível como funcionalidade da interface.</p>
                <p>Entre os direitos aplicáveis, estão:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>Confirmação e acesso: solicitar a confirmação do tratamento e o acesso aos dados pessoais mantidos pelo LabSafe.</li>
                    <li>Correção: solicitar a correção de dados pessoais incorretos ou desatualizados.</li>
                    <li>Exclusão: solicitar a exclusão de seus dados pessoais, quando aplicável.</li>
                    <li>Informações sobre o uso dos dados: solicitar informações sobre a finalidade do tratamento e o uso de seus dados.</li>
                    <li>Informações sobre compartilhamento: solicitar informações sobre os serviços externos que recebem dados relacionados às funcionalidades da plataforma.</li>
                    <li>Anonimização, bloqueio e portabilidade: solicitar essas medidas nas hipóteses previstas na legislação aplicável.</li>
                    <li>Consentimento: quando o tratamento depender de consentimento, solicitar informações sobre suas consequências e a revogação do consentimento fornecido.</li>
                    <li>Resultados automatizados: solicitar informações sobre os critérios utilizados no cálculo dos resultados dos quizzes e a revisão de decisões automatizadas, quando aplicável.</li>
                </ul>
            </DocumentSection>
            <DocumentSection title="8. Segurança e alterações da política" contentClassName="mt-4">
                <p>O LabSafe adota medidas de segurança para proteger os dados pessoais utilizados pela plataforma.</p>
                <p>Entre as medidas implementadas estão:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>Proteção das senhas: as senhas dos usuários são armazenadas em formato de hash, não sendo armazenadas em texto simples.</li>
                    <li>Autenticação: o acesso às contas é realizado por meio de autenticação utilizando e-mail e senha.</li>
                    <li>Links de acesso: os convites de criação de senha e os links de recuperação são válidos por 5 minutos a partir de sua geração. Links expirados, utilizados, substituídos ou invalidados pela alteração do e-mail cadastrado deixam de permitir a operação correspondente. Um novo convite de criação de senha deve ser solicitado ao administrador.</li>
                    <li>Controle de acesso: as funcionalidades da plataforma são protegidas de acordo com o perfil e as permissões do usuário.</li>
                    <li>Registros de auditoria: acontecimentos e ações relevantes do sistema são registrados para auxiliar no acompanhamento e na segurança da plataforma.</li>
                </ul>
                <p>Apesar das medidas adotadas, nenhum sistema pode garantir segurança absoluta contra todos os riscos existentes.</p>
                <p>Esta Política de Privacidade poderá ser atualizada quando houver alterações no funcionamento da plataforma, no tratamento dos dados ou nas medidas de segurança adotadas.</p>
                <p><strong>Versão:</strong> 1.2</p>
                <p><strong>Data da última atualização:</strong> 16/11/2026</p>
            </DocumentSection>
            <DocumentSection title="9. Contato" contentClassName="mt-4">
                <p><strong>Contato do responsável pelo projeto:</strong> <a href="mailto:joaogoncalves3m@gmail.com" className="text-primary underline [overflow-wrap:anywhere]">joaogoncalves3m@gmail.com</a>.</p>
                <p>Esse canal poderá ser utilizado para solicitações relacionadas aos dados pessoais, à Política de Privacidade ou ao funcionamento da plataforma.</p>
            </DocumentSection>
        </DocumentLayout>
    )
}

export default Privacy;
