import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, hasCloseBtn = false, onClose, children, className }) => {
    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        }
        setModalOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        const modalElement = modalRef.current;

        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);

    const modalClasses = className ? className : 'modal m-0 top-28 left-1/2 -translate-x-1/2 w-11/12 max-h-[75%]';

    return (
        <div className="m-0, position-absolute">
            <dialog ref={modalRef} onKeyDown={handleKeyDown} className={modalClasses}>
                {hasCloseBtn && (
                    <a href="#" className="pr-2 pt-2 modal-close-btn" onClick={handleCloseModal}>
                        X
                    </a>
                )}
                {children}
            </dialog>
        </div>
    );
};

export default Modal;
