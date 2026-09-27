import { useNavigate } from "react-router-dom";
import Content from "../components/Content";

function Privacy() {
    const navigate = useNavigate();

    function handleLogout() {
        navigate("/");
    }

    return (
        <Content>
            <h1 className="text-center text-title font-bold">Política de Privacidade</h1>
            <main className="flex flex-col gap-2 mt-4">
                <section>
                    <h2 className="font-bold my-2">1. Quem é responsável pelos dados</h2>
                    <div className="flex flex-col gap-2 text-small">
                        <p>O LabSafe é uma plataforma desenvolvida como projeto acadêmico do curso de Engenharia de Software, com o objetivo de oferecer treinamento e capacitação em segurança laboratorial.</p>
                        <p>Nesta versão acadêmica, o LabSafe é considerado responsável pelo tratamento dos dados pessoais utilizados para o funcionamento da plataforma.</p>
                        <p>Em uma futura utilização do sistema em uma instituição de ensino, empresa ou outra organização, a responsabilidade pelo tratamento dos dados deverá ser definida de acordo com a organização responsável pela utilização da plataforma.</p>
                        <p>Para dúvidas ou solicitações relacionadas ao tratamento de dados pessoais, o usuário poderá utilizar o canal de contato informado na seção <strong>9. Contato</strong>.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">2. Quais dados coletamos</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p className="mb-2">Para o funcionamento da plataforma, o LabSafe utiliza os seguintes dados pessoais:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li><strong>Nome:</strong> utilizado para identificar o usuário dentro da plataforma.</li>
                            <li><strong>E-mail:</strong> utilizado para identificar a conta do usuário e realizar a autenticação.</li>
                            <li><strong>Senha:</strong> utilizada para realizar a autenticação e permitir o acesso à conta. A senha não é armazenada em texto simples, sendo armazenada em formato de hash.</li>
                            <li><strong>Perfil:</strong> utilizado para definir a função do usuário na plataforma e determinar quais funcionalidades e recursos ele pode acessar. Os perfis disponíveis são Admin, Professor(a) e Aluno(a).</li>
                            <li><strong>Registros de auditoria:</strong> utilizados para registrar acontecimentos e ações relevantes ocorridos dentro do sistema, como autenticação, cadastro, alteração de dados e tentativas de acesso sem autorização.</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">3. Por que usamos seus dados</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>Os dados pessoais utilizados pelo LabSafe são necessários para permitir o funcionamento da plataforma e suas principais funcionalidades.</p>
                        <p>Os dados são utilizados para:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>Cadastrar e identificar o usuário na plataforma.</li>
                            <li>Realizar a autenticação e o login, permitindo que o usuário acesse sua conta.</li>
                            <li>Definir o perfil e as permissões de acesso, permitindo que cada usuário tenha acesso às funcionalidades e conteúdos correspondentes à sua função.</li>
                            <li>Registrar acontecimentos e ações relevantes do sistema, por meio dos registros de auditoria, contribuindo para o acompanhamento e a segurança da plataforma.</li>
                        </ul>
                        <p>Dessa forma, o tratamento dos dados permite que o LabSafe cadastre os usuários, controle o acesso à plataforma e disponibilize os conteúdos de acordo com o perfil de cada usuário.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">4. Serviços externos e compartilhamento</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>O LabSafe utiliza a PubChem como serviço externo para permitir a consulta de informações sobre reagentes e compostos químicos.</p>
                        <p>Quando o usuário realiza uma consulta, o LabSafe envia ao PubChem o nome do reagente ou composto pesquisado para obter informações como:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>CID;</li>
                            <li>Nome do composto;</li>
                            <li>Fórmula molecular;</li>
                            <li>Peso molecular;</li>
                        </ul>
                        <p>O PubChem não recebe os dados pessoais cadastrados no LabSafe, como nome, e-mail, senha ou perfil do usuário.</p>
                        <p>As informações retornadas pelo PubChem são utilizadas pelo LabSafe apenas para apresentar os dados do composto consultado ao usuário.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">5. Armazenamento local</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>O LabSafe utiliza o localStorage do navegador para armazenar o token de autenticação utilizado para manter o acesso do usuário à plataforma.</p>
                        <p>Quando o usuário clica em sair, o token armazenado no localStorage é removido, encerrando o acesso autenticado naquele navegador.</p>
                        <p>O LabSafe não utiliza cookies para armazenar o token de autenticação.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">6. Armazenamento e exclusão de dados</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>Os dados dos usuários são armazenados no banco de dados do LabSafe enquanto a conta estiver cadastrada na plataforma.</p>
                        <p>As senhas são armazenadas em formato de hash, não sendo mantidas em texto simples.</p>
                        <p>Atualmente, quando um usuário é excluído, seu cadastro é removido do banco de dados por meio do processo de exclusão da plataforma.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">7. Seus direitos</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>O usuário poderá solicitar informações sobre o tratamento de seus dados pessoais pelo LabSafe.</p>
                        <p>Entre os direitos aplicáveis, estão:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>Acesso: solicitar informações sobre os dados pessoais mantidos pelo LabSafe.</li>
                            <li>Correção: solicitar a correção de dados pessoais incorretos ou desatualizados.</li>
                            <li>Exclusão: solicitar a exclusão de seus dados pessoais, quando aplicável.</li>
                            <li>Informações sobre o uso dos dados: solicitar informações sobre a finalidade do tratamento e o uso de seus dados.</li>
                            <li>Informações sobre compartilhamento: solicitar informações sobre os serviços externos que recebem dados relacionados às funcionalidades da plataforma.</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">8. Segurança e alterações da política</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p>O LabSafe adota medidas de segurança para proteger os dados pessoais utilizados pela plataforma.</p>
                        <p>Entre as medidas implementadas estão:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>Proteção das senhas: as senhas dos usuários são armazenadas em formato de hash, não sendo armazenadas em texto simples.</li>
                            <li>Autenticação: o acesso às contas é realizado por meio de autenticação utilizando e-mail e senha.</li>
                            <li>Controle de acesso: as funcionalidades da plataforma são protegidas de acordo com o perfil e as permissões do usuário.</li>
                            <li>Registros de auditoria: acontecimentos e ações relevantes do sistema são registrados para auxiliar no acompanhamento e na segurança da plataforma.</li>
                        </ul>
                        <p>Apesar das medidas adotadas, nenhum sistema pode garantir segurança absoluta contra todos os riscos existentes.</p>
                        <p>Esta Política de Privacidade poderá ser atualizada quando houver alterações no funcionamento da plataforma, no tratamento dos dados ou nas medidas de segurança adotadas.</p>
                        <p><strong>Versão:</strong> 1.0</p>
                        <p><strong>Data da última atualização:</strong> 27/09/2026</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">9. Contato</h2>
                    <div className="flex flex-col gap-2 text-small mt-4">
                        <p><strong>E-mail:</strong> joaogoncalves3m@gmail.com</p>
                        <p>Esse canal poderá ser utilizado para solicitações relacionadas aos dados pessoais, à Política de Privacidade ou ao funcionamento da plataforma.</p>
                    </div>
                </section>
            </main>
            <div className="flex justify-center mt-4">
                <button onClick={handleLogout} className="border border-border text-border font-bold bg-white p-2 rounded-md cursor-pointer">Voltar</button>
            </div>
        </Content>
    )
}

export default Privacy;