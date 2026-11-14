interface StatusProps {
    ativo: boolean;
}

function Status({ ativo }: StatusProps) {
    const color = ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    return (
        <span className={`inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-center text-small font-semibold whitespace-nowrap ${color}`}>
            {ativo ? "Ativo" : "Inativo"}
        </span>
    );
}

export default Status;
