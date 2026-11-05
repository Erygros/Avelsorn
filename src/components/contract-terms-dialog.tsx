"use client";
import { useId, useRef } from "react";

export function ContractTermsDialog({ text }: { text: string }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const heading = useId();
    return (
        <div className="mt-4">
            <button
                className="text-button"
                type="button"
                onClick={() => {
                    dialog.current?.showModal();
                    if (dialog.current) dialog.current.scrollTop = 0;
                }}
            >
                Vertragsbedingungen lesen
            </button>
            <dialog
                ref={dialog}
                className="contract-dialog"
                aria-labelledby={heading}
            >
                <button
                    type="button"
                    className="button small"
                    autoFocus
                    onClick={() => dialog.current?.close()}
                >
                    Schließen
                </button>
                <h2 id={heading}>Vertrag und Widerruf</h2>
                <p>{text}</p>
            </dialog>
        </div>
    );
}
