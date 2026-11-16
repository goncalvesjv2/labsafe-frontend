import { Link } from "react-router-dom";
import DocumentLayout from "../components/DocumentLayout";
import DocumentSection from "../components/DocumentSection";

function Terms() {
    return (
        <DocumentLayout title="Termos de Uso">
            <DocumentSection title="1. Sobre o LabSafe">
                <p>O LabSafe é uma plataforma desenvolvida como projeto acadêmico do curso de Engenharia de Software, com o objetivo de oferecer treinamento e capacitação em segurança laboratorial.</p>
                <p>A plataforma disponibiliza conteúdos educacionais e recursos destinados a auxiliar usuários no aprendizado de práticas relacionadas à segurança em ambientes laboratoriais.</p>
                <p>Nesta versão, o LabSafe possui finalidade exclusivamente acadêmica e está sendo desenvolvido como parte de um projeto de conclusão de curso.</p>
            </DocumentSection>
            <DocumentSection title="2. Aceitação dos Termos">
                <p>Ao utilizar o LabSafe, o usuário declara que leu e concorda com estes Termos de Uso.</p>
                <p>Para realizar o acesso à plataforma, o usuário deverá marcar a opção indicando que leu e aceita os Termos de Uso e a Política de Privacidade.</p>
                <p>As informações sobre coleta, uso, compartilhamento e exclusão de dados pessoais estão descritas na <Link to="/privacy-policies" className="text-primary underline">Política de Privacidade</Link>.</p>
                <p>Caso o usuário não concorde com estes Termos, não deverá utilizar a plataforma.</p>
                <p>Os presentes Termos poderão ser atualizados conforme alterações no funcionamento, nas funcionalidades ou nas características do LabSafe.</p>
            </DocumentSection>
            <DocumentSection title="3. Cadastro e conta do usuário">
                <p>Para utilizar as funcionalidades que exigem autenticação, o usuário deverá possuir uma conta cadastrada na plataforma.</p>
                <p>O cadastro é realizado por um administrador, que informa o nome, o e-mail e o perfil de acesso do usuário. O usuário recebe um convite por e-mail para definir sua própria senha.</p>
                <p>O convite é válido por <strong>5 minutos a partir de sua geração</strong>. Se expirar ou já tiver sido utilizado sem que o usuário consiga acessar a conta, deverá ser solicitado auxílio ao administrador. O reenvio de convite está disponível para contas ativas que ainda não definiram uma senha e invalida o convite anterior.</p>
                <p>Se o e-mail tiver sido cadastrado incorretamente, o usuário deverá solicitar sua correção ao administrador ou pelo canal da seção <strong>13. Contato</strong>. Após salvar a correção, o administrador deverá reenviar o convite ao novo endereço, caso a senha ainda não tenha sido definida. A alteração do e-mail invalida os links anteriores de convite e recuperação de senha.</p>
                <p>Quem já definiu uma senha poderá utilizar a opção <strong>Esqueci minha senha</strong> para solicitar um link de recuperação ao e-mail cadastrado. Esse link também é válido por <strong>5 minutos a partir de sua geração</strong>. Se expirar ou já tiver sido utilizado, um novo link poderá ser solicitado pela mesma opção ou por <strong>Solicitar um novo link</strong> na página de redefinição de senha.</p>
                <p>Os convites e os links de recuperação, inclusive os solicitados novamente após expiração, são enviados pelo Gmail. O usuário deverá manter acesso ao endereço cadastrado, proteger os links recebidos e manter suas credenciais em segurança.</p>
                <p>Cada conta possui um perfil de acesso definido na plataforma. Os perfis disponíveis são:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li><strong>Admin:</strong> pode consultar e cadastrar usuários, editar dados cadastrais, reenviar convites e desativar ou reativar contas pelas funcionalidades administrativas. A edição e a desativação da própria conta não estão disponíveis.</li>
                    <li><strong>Professor(a):</strong> pode consultar conteúdos e quizzes, criar materiais, editar e excluir os de sua autoria e acompanhar o desempenho dos alunos nos próprios quizzes.</li>
                    <li><strong>Aluno(a):</strong> pode consultar conteúdos, responder aos quizzes disponíveis, visualizar seus resultados e pesquisar compostos químicos.</li>
                </ul>
                <p>O usuário não deverá utilizar as credenciais de outra pessoa ou tentar acessar recursos que não estejam disponíveis para o seu perfil.</p>
            </DocumentSection>
            <DocumentSection title="4. Uso da plataforma">
                <p>O LabSafe deverá ser utilizado de acordo com sua finalidade educacional e acadêmica.</p>
                <p>O usuário compromete-se a utilizar a plataforma de forma adequada e a respeitar as permissões estabelecidas para seu perfil de acesso.</p>
                <p>Não é permitido utilizar o LabSafe para:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>tentar obter acesso não autorizado a contas, dados ou funcionalidades;</li>
                    <li>utilizar recursos destinados a outros perfis sem a devida autorização;</li>
                    <li>interferir no funcionamento da plataforma;</li>
                    <li>realizar ações que possam comprometer a segurança ou disponibilidade do sistema;</li>
                    <li>utilizar a plataforma para finalidades ilegais ou incompatíveis com sua finalidade educacional.</li>
                </ul>
                <p>As funcionalidades disponíveis ao usuário poderão variar de acordo com seu perfil e com as características da versão da plataforma.</p>
            </DocumentSection>
            <DocumentSection title="5. Conteúdos de treinamento">
                <p>Os conteúdos disponibilizados pelo LabSafe possuem finalidade educacional e têm como objetivo auxiliar no treinamento e na capacitação relacionados à segurança laboratorial.</p>
                <p>Professores podem criar conteúdos e quizzes e gerenciar os materiais de sua autoria. As ações de exclusão apresentam uma confirmação antes do envio do pedido.</p>
                <p>Os conteúdos da plataforma não substituem normas, procedimentos operacionais, treinamentos institucionais, orientações de profissionais responsáveis ou demais instruções de segurança adotadas pelo laboratório ou pela instituição responsável.</p>
                <p>Em situações reais de laboratório, o usuário deverá seguir os procedimentos e orientações de segurança estabelecidos pela instituição responsável pelo ambiente.</p>
                <p>O LabSafe não deve ser utilizado como única fonte para tomada de decisões relacionadas à segurança, manipulação, armazenamento ou utilização de substâncias químicas.</p>
            </DocumentSection>
            <DocumentSection title="6. Quizzes, tentativas e resultados">
                <p>Os quizzes permitem avaliar o aprendizado dos alunos sobre os conteúdos de treinamento. Para enviar uma tentativa, o aluno deverá selecionar uma alternativa em cada questão.</p>
                <p>A plataforma registra as respostas enviadas, as tentativas, a nota, a situação de aprovação e a data e o horário de realização. Para ser aprovado, é necessário acertar pelo menos <strong>60% das questões</strong>.</p>
                <p>Após a aprovação em um quiz, novas tentativas desse quiz ficam bloqueadas para o aluno. Enquanto não houver aprovação, o aluno poderá realizar uma nova tentativa ao acessar novamente o quiz, desde que ele continue disponível para resposta.</p>
                <p>O aluno pode consultar seus próprios resultados. O professor responsável pelo quiz pode consultar o nome dos alunos, a quantidade de tentativas e a nota, a situação de aprovação e a data e o horário da tentativa mais recente.</p>
                <p>A exclusão de um quiz pelo professor responsável também remove suas questões, alternativas e tentativas dos alunos, conforme informado no diálogo de confirmação.</p>
                <p>O resultado representa o desempenho no quiz dentro do contexto educacional do LabSafe. A autorização para realizar atividades ou ingressar em um laboratório depende dos critérios e das orientações da instituição responsável.</p>
            </DocumentSection>
            <DocumentSection title="7. Consulta de informações sobre compostos químicos">
                <p>O LabSafe disponibiliza aos alunos a página <strong>Compostos</strong> para consultar informações sobre compostos químicos utilizando o serviço externo PubChem. O nome do composto deverá ser informado em inglês, conforme a orientação apresentada no campo de consulta.</p>
                <p>A consulta permite obter informações de referência sobre o composto pesquisado, incluindo:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>CID;</li>
                    <li>nome do composto;</li>
                    <li>fórmula molecular;</li>
                    <li>peso molecular.</li>
                </ul>
                <p>As informações obtidas por meio do PubChem possuem finalidade de consulta e referência dentro da plataforma.</p>
                <p>Essas informações não substituem fichas de segurança, procedimentos laboratoriais, orientações de profissionais qualificados, normas técnicas ou instruções da instituição responsável pelo laboratório.</p>
                <p>O usuário deve considerar as informações disponíveis na plataforma dentro do contexto educacional do LabSafe e seguir os procedimentos oficiais aplicáveis ao ambiente em que estiver realizando atividades laboratoriais.</p>
            </DocumentSection>
            <DocumentSection title="8. Responsabilidades do usuário">
                <p>O usuário é responsável pela utilização adequada de sua conta e dos recursos disponibilizados pelo LabSafe.</p>
                <p>Entre suas responsabilidades estão:</p>
                <ul className="flex flex-col gap-2 list-disc ml-6">
                    <li>manter suas credenciais de acesso em segurança;</li>
                    <li>não compartilhar sua senha com outras pessoas;</li>
                    <li>utilizar somente os recursos autorizados para seu perfil;</li>
                    <li>fornecer informações corretas durante o cadastro;</li>
                    <li>conferir os dados cadastrados e solicitar ao administrador a correção de informações incorretas, especialmente do e-mail;</li>
                    <li>proteger os links de convite e recuperação de senha e responder aos quizzes utilizando sua própria conta;</li>
                    <li>não tentar acessar dados ou contas de outros usuários;</li>
                    <li>não realizar ações que possam comprometer a segurança ou funcionamento da plataforma;</li>
                    <li>utilizar os conteúdos e funcionalidades do LabSafe de acordo com sua finalidade educacional.</li>
                </ul>
                <p>Caso identifique uma situação que possa comprometer a segurança da plataforma, o usuário deverá comunicar o responsável por meio do canal de contato disponibilizado pelo LabSafe.</p>
            </DocumentSection>
            <DocumentSection title="9. Segurança e disponibilidade da plataforma">
                <p>O LabSafe utiliza mecanismos de segurança para proteger o acesso à plataforma, incluindo autenticação, controle de acesso por perfil e registros de auditoria.</p>
                <p>Apesar das medidas adotadas, nenhum sistema pode garantir segurança absoluta contra todos os riscos existentes.</p>
                <p>O funcionamento da plataforma também pode ser afetado por problemas técnicos, manutenção, indisponibilidade de serviços externos ou outras situações que estejam fora do controle do projeto.</p>
                <p>A utilização do PubChem depende da disponibilidade do serviço externo. Caso esse serviço esteja indisponível, a funcionalidade de consulta de compostos poderá não funcionar temporariamente.</p>
                <p>O recebimento de convites e mensagens de recuperação de senha também depende do funcionamento do Gmail e do serviço de e-mail do destinatário. Em caso de falha no envio ou expiração de um link, o usuário deverá utilizar a opção de nova solicitação ou pedir o reenvio do convite ao administrador, conforme o caso.</p>
            </DocumentSection>
            <DocumentSection title="10. Propriedade intelectual">
                <p>Os conteúdos, elementos visuais, código-fonte, estrutura e demais elementos desenvolvidos especificamente para o LabSafe fazem parte do projeto acadêmico e estão sujeitos aos direitos aplicáveis aos seus respectivos autores e responsáveis.</p>
                <p>O usuário poderá utilizar os recursos disponibilizados pelo LabSafe de acordo com sua finalidade educacional.</p>
                <p>A reprodução, distribuição, modificação ou utilização dos conteúdos e elementos do projeto para finalidades diferentes das permitidas deverá respeitar os direitos dos respectivos autores e as normas aplicáveis.</p>
                <p>As informações provenientes de serviços externos, como o PubChem, permanecem sujeitas aos termos, condições e direitos aplicáveis às respectivas fontes.</p>
            </DocumentSection>
            <DocumentSection title="11. Desativação e exclusão de conta">
                <p>O administrador pode desativar ou reativar contas de usuários pelas funcionalidades de gerenciamento. A desativação suspende o acesso e mantém o cadastro armazenado para uma possível reativação.</p>
                <p>Professores e alunos podem excluir a própria conta na página <strong>Perfil</strong>, pelo botão <strong>Excluir minha conta</strong>. A plataforma apresenta um diálogo para confirmar a decisão antes de enviar o pedido de exclusão.</p>
                <p>Após a confirmação e a conclusão da operação, o cadastro e os dados vinculados à conta são removidos do banco de dados. Essa remoção inclui as respostas e tentativas do usuário, os conteúdos e quizzes de sua autoria e os registros de auditoria vinculados à conta.</p>
                <p>A sessão utilizada para realizar a exclusão é encerrada e o usuário perde o acesso à conta excluída. A operação é definitiva e não pode ser desfeita pela interface.</p>
                <p>Administradores não dispõem da opção de excluir a própria conta pela página Perfil. Solicitações relacionadas à conta ou aos dados pessoais podem ser encaminhadas pelo canal da seção <strong>13. Contato</strong>.</p>
                <p>Mais informações sobre o tratamento de dados pessoais estão disponíveis na <Link to="/privacy-policies" className="text-primary underline">Política de Privacidade</Link>.</p>
            </DocumentSection>
            <DocumentSection title="12. Alterações dos Termos de Uso">
                <p>Estes Termos de Uso poderão ser atualizados quando houver alterações no funcionamento da plataforma, nas funcionalidades disponibilizadas ou nas condições de utilização do LabSafe.</p>
                <p>Quando houver uma atualização, a versão e a data da última atualização serão informadas neste documento.</p>
                <p>A versão atualmente vigente é:</p>
                <p><strong>Versão:</strong> 1.1</p>
                <p><strong>Data da última atualização:</strong> 16/11/2026</p>
            </DocumentSection>
            <DocumentSection title="13. Contato">
                <p>Para dúvidas, solicitações ou informações relacionadas aos Termos de Uso, à utilização da plataforma ou às funcionalidades do LabSafe, o usuário poderá entrar em contato pelo seguinte canal:</p>
                <p><strong>Contato do responsável pelo projeto:</strong> <a href="mailto:joaogoncalves3m@gmail.com" className="text-primary underline [overflow-wrap:anywhere]">joaogoncalves3m@gmail.com</a>.</p>
                <p>Esse canal também poderá ser utilizado para questões relacionadas à Política de Privacidade e ao tratamento de dados pessoais.</p>
            </DocumentSection>
        </DocumentLayout>
    )
}

export default Terms;
