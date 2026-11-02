import Card from "../components/Card";
import Title from "../components/Title";
import Button from "../components/Button";
import { Pencil, Trash } from "lucide-react";

function Content() {
    return (
        <>
            <Title>Conteúdo</Title>
            <p className="text-normal text-border font-bold">Crie um conteúdo contendo título e descrição</p>
            <div className="flex justify-end mt-4">
                <Button>
                    Criar conteúdo
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
                <Card className="min-w-0">
                    <p className="text-normal font-bold">Equipamento de Proteção Individual</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button>Acessar</Button>
                        <Button variant="secondary">
                            <Pencil size={16} />
                            Editar
                        </Button>
                        <Button variant="secondary">
                            <Trash size={16} />
                            Excluir
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default Content;
