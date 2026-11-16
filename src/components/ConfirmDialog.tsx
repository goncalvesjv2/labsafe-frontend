import { useEffect, useId, useRef } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    busy?: boolean;
    error?: string;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
}

function ConfirmDialog({ open, title, description, confirmLabel, busy = false, error, onCancel, onConfirm }: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const confirming = useRef(false);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();

        return () => { if (dialog.open) dialog.close(); };
    }, [open]);

    function handleCancel() {
        if (!busy && !confirming.current) onCancel();
    }

    async function handleConfirm() {
        if (busy || confirming.current) return;
        confirming.current = true;
        try {
            await onConfirm();
        } finally {
            confirming.current = false;
        }
    }

    return (
        <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={busy}
            onCancel={(event) => { event.preventDefault(); handleCancel(); }}
            className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-lg bg-white p-6 text-black shadow-xl backdrop:bg-black/50">
            <h2 id={titleId} className="text-normal font-bold">{title}</h2>
            <p id={descriptionId} className="mt-3 text-normal [overflow-wrap:anywhere]">{description}</p>
            {error && <p role="alert" className="mt-3 text-small text-red-600">{error}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Button variant="secondary" autoFocus disabled={busy} onClick={handleCancel}>Cancelar</Button>
                <Button disabled={busy} onClick={handleConfirm} className="bg-red-700 hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
                    {busy ? "Excluindo..." : confirmLabel}
                </Button>
            </div>
        </dialog>
    );
}

export default ConfirmDialog;
