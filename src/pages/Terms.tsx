import { useNavigate } from "react-router-dom";
import Content from "../components/Content";

function Terms() {
    const navigate = useNavigate();

    function handleLogout() {
        navigate("/");
    }
    
    return (
        <Content>
            <h1 className="text-title font-bold text-center">Termos de Uso</h1>
            <main className="flex flex-col gap-2">
                <section>
                    <h2 className="font-bold my-2">1. Sobre o LabSafe</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>O LabSafe é uma plataforma desenvolvida como projeto acadêmico do curso de Engenharia de Software, com o objetivo de oferecer treinamento e capacitação em segurança laboratorial.</p>
                        <p>A plataforma disponibiliza conteúdos educacionais e recursos destinados a auxiliar usuários no aprendizado de práticas relacionadas à segurança em ambientes laboratoriais.</p>
                        <p>Nesta versão, o LabSafe possui finalidade exclusivamente acadêmica e está sendo desenvolvido como parte de um projeto de conclusão de curso.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">2. Aceitação dos Termos</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Ao utilizar o LabSafe, o usuário declara que leu e concorda com estes Termos de Uso.</p>
                        <p>Para realizar o acesso à plataforma, o usuário deverá marcar a opção indicando que leu e aceita os Termos de Uso e a Política de Privacidade.</p>
                        <p>Caso o usuário não concorde com estes Termos, não deverá utilizar a plataforma.</p>
                        <p>Os presentes Termos poderão ser atualizados conforme alterações no funcionamento, nas funcionalidades ou nas características do LabSafe.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">3. Cadastro e conta do usuário</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Para utilizar as funcionalidades que exigem autenticação, o usuário deverá possuir uma conta cadastrada na plataforma.</p>
                        <p>Durante o cadastro, poderão ser solicitados dados como nome, e-mail, senha e perfil de acesso.</p>
                        <p>O usuário é responsável por fornecer informações corretas e manter suas credenciais de acesso protegidas.</p>
                        <p>Cada conta possui um perfil de acesso definido na plataforma. Os perfis disponíveis são:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>Admin: possui acesso às funcionalidades administrativas disponíveis na plataforma.</li>
                            <li>Professor(a): possui acesso às funcionalidades disponibilizadas para o perfil de professor.</li>
                            <li>Aluno(a): possui acesso às funcionalidades disponibilizadas para o perfil de aluno.</li>
                        </ul>
                        <p>O usuário não deverá utilizar as credenciais de outra pessoa ou tentar acessar recursos que não estejam disponíveis para o seu perfil.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">4. Uso da plataforma</h2>
                    <div className="flex flex-col text-small gap-2">
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
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">5. Conteúdos de treinamento</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Os conteúdos disponibilizados pelo LabSafe possuem finalidade educacional e têm como objetivo auxiliar no treinamento e na capacitação relacionados à segurança laboratorial.</p>
                        <p>Os conteúdos da plataforma não substituem normas, procedimentos operacionais, treinamentos institucionais, orientações de profissionais responsáveis ou demais instruções de segurança adotadas pelo laboratório ou pela instituição responsável.</p>
                        <p>Em situações reais de laboratório, o usuário deverá seguir os procedimentos e orientações de segurança estabelecidos pela instituição responsável pelo ambiente.</p>
                        <p>O LabSafe não deve ser utilizado como única fonte para tomada de decisões relacionadas à segurança, manipulação, armazenamento ou utilização de substâncias químicas.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">6. Consulta de informações sobre compostos químicos</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>O LabSafe disponibiliza uma funcionalidade de consulta de informações sobre reagentes e compostos químicos utilizando o serviço externo PubChem.</p>
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
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">7. Responsabilidades do usuário</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>O usuário é responsável pela utilização adequada de sua conta e dos recursos disponibilizados pelo LabSafe.</p>
                        <p>Entre suas responsabilidades estão:</p>
                        <ul className="flex flex-col gap-2 list-disc ml-6">
                            <li>manter suas credenciais de acesso em segurança;</li>
                            <li>não compartilhar sua senha com outras pessoas;</li>
                            <li>utilizar somente os recursos autorizados para seu perfil;</li>
                            <li>fornecer informações corretas durante o cadastro;</li>
                            <li>não tentar acessar dados ou contas de outros usuários;</li>
                            <li>não realizar ações que possam comprometer a segurança ou funcionamento da plataforma;</li>
                            <li>utilizar os conteúdos e funcionalidades do LabSafe de acordo com sua finalidade educacional.</li>
                        </ul>
                        <p>Caso identifique uma situação que possa comprometer a segurança da plataforma, o usuário deverá comunicar o responsável por meio do canal de contato disponibilizado pelo LabSafe.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">8. Segurança e disponibilidade da plataforma</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>O LabSafe utiliza mecanismos de segurança para proteger o acesso à plataforma, incluindo autenticação, controle de acesso por perfil e registros de auditoria.</p>
                        <p>Apesar das medidas adotadas, nenhum sistema pode garantir segurança absoluta contra todos os riscos existentes.</p>
                        <p>O funcionamento da plataforma também pode ser afetado por problemas técnicos, manutenção, indisponibilidade de serviços externos ou outras situações que estejam fora do controle do projeto.</p>
                        <p>A utilização do PubChem depende da disponibilidade do serviço externo. Caso esse serviço esteja indisponível, a funcionalidade de consulta de compostos poderá não funcionar temporariamente.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">9. Propriedade intelectual</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Os conteúdos, elementos visuais, código-fonte, estrutura e demais elementos desenvolvidos especificamente para o LabSafe fazem parte do projeto acadêmico e estão sujeitos aos direitos aplicáveis aos seus respectivos autores e responsáveis.</p>
                        <p>O usuário poderá utilizar os recursos disponibilizados pelo LabSafe de acordo com sua finalidade educacional.</p>
                        <p>A reprodução, distribuição, modificação ou utilização dos conteúdos e elementos do projeto para finalidades diferentes das permitidas deverá respeitar os direitos dos respectivos autores e as normas aplicáveis.</p>
                        <p>As informações provenientes de serviços externos, como o PubChem, permanecem sujeitas aos termos, condições e direitos aplicáveis às respectivas fontes.</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">10. Alterações dos Termos de Uso</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Estes Termos de Uso poderão ser atualizados quando houver alterações no funcionamento da plataforma, nas funcionalidades disponibilizadas ou nas condições de utilização do LabSafe.</p>
                        <p>Quando houver uma atualização, a versão e a data da última atualização serão informadas neste documento.</p>
                        <p>A versão atualmente vigente é:</p>
                        <p><strong>Versão:</strong> 1.0</p>
                        <p><strong>Data da última atualização:</strong> 27/09/2026</p>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold my-2">11. Contato</h2>
                    <div className="flex flex-col text-small gap-2">
                        <p>Para dúvidas, solicitações ou informações relacionadas aos Termos de Uso, à utilização da plataforma ou às funcionalidades do LabSafe, o usuário poderá entrar em contato pelo seguinte canal:</p>
                        <p><strong>E-mail:</strong> joaogoncalves3m@gmail.com</p>
                        <p>Esse canal também poderá ser utilizado para questões relacionadas à Política de Privacidade e ao tratamento de dados pessoais.</p>
                    </div>
                </section>
            </main>
            <div className="flex justify-center mt-4">
                <button onClick={handleLogout} className="border border-border text-border font-bold bg-white p-2 rounded-md cursor-pointer">Voltar</button>
            </div>
        </Content>
    )
}

export default Terms;