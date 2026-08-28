import { useEffect, useRef } from "react";
import "../../styles/common/ConfirmationDialog.css";

function ConfirmationDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = false
}) {

    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const previousActiveElement = document.activeElement;

        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
                return;
            }

            if (event.key === "Tab") {

                const focusableElements =
                    dialogRef.current?.querySelectorAll(
                        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
                    );

                if (!focusableElements?.length) {
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement =
                    focusableElements[focusableElements.length - 1];

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastElement
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {

            document.removeEventListener("keydown", handleKeyDown);

            if (
                previousActiveElement &&
                typeof previousActiveElement.focus === "function"
            ) {
                previousActiveElement.focus();
            }

        };

    }, [isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="confirmation-dialog-overlay"
            role="presentation"
        >

            <div
                ref={dialogRef}
                className="confirmation-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-message"
            >

                <h2 id="confirmation-dialog-title">
                    {title}
                </h2>

                <p id="confirmation-dialog-message">
                    {message}
                </p>

                <div className="confirmation-dialog-actions">

                    <button
                        ref={cancelButtonRef}
                        type="button"
                        className="confirmation-dialog-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={
                            danger
                                ? "confirmation-dialog-confirm danger"
                                : "confirmation-dialog-confirm"
                        }
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmationDialog;