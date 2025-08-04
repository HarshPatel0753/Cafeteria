import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import Swal from "sweetalert2";
const Modal = forwardRef(function Modal(
    {
        id = "default",
        closeModal,
        title,
        footer,
        children,
        modalSize = "",
        closeModalButton,
    },
    ref
) {
    const [modal, setModal] = useState(null);
    useEffect(() => {
        setModal(new bootstrap.Modal(document.getElementById(id)));
    }, []);

    const show = () => {
        modal.show();
    };
    const close = (value = false) => {
        let action = closeModalButton();
        if (value === true && action === true) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success m-1",
                    cancelButton: "btn btn-danger m-1",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons
                .fire({
                    title: "Are you sure?",
                    text: "You won't to go back! your all data will be remove.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        closeModal();
                        modal.hide();
                    }
                });
        } else {
            closeModal();
            modal.hide();
        }
    };

    useImperativeHandle(ref, () => {
        return {
            show,
            close,
        };
    });

    return (
        <>
            <div
                className="modal fade"
                id={id}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className={`modal-dialog ${modalSize}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <div
                                className="modal-title fs-5"
                                id="staticBackdropLabel"
                            >
                                {title}
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => close(true)}
                            ></button>
                        </div>
                        <div className="modal-body">{children}</div>
                        <div className="modal-footer">
                            {footer}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => close(true)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Modal;
