import { useEffect, useRef } from "react";
import Button from "./Button";

interface ModalProps {
    open: boolean;
    description?: string;
    busy?: boolean;
    error?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

function Modal({ open, description, busy = false, error, onCancel, onConfirm }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open) dialog?.showModal();
        else dialog?.close();
    }, [open]);

    return (
        <dialog ref={dialogRef} aria-label="Confirmação de exclusão" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }} className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-lg bg-white p-6 text-black shadow-xl backdrop:bg-black/50">
            <h2 className="text-center text-normal font-bold">Você tem certeza que deseja excluir?</h2>
            {description && <p className="mt-3 text-center text-normal [overflow-wrap:anywhere]">{description}</p>}
            {error && <p role="alert" className="mt-3 text-small text-red-600">{error}</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button disabled={busy} onClick={onConfirm} className="min-w-24 px-6">
                    {busy ? "Excluindo..." : "Sim"}
                </Button>
                <Button variant="secondary" autoFocus disabled={busy} onClick={onCancel} className="min-w-24 bg-white px-6">Não</Button>
            </div>
        </dialog>
    );
}

export default Modal;
