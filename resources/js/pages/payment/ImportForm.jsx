import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { router } from "@inertiajs/react";

const ImportForm = forwardRef(function ImportForm(props, ref) {
    const modalRef = useRef(null);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState(null);

    // Open modal and reset input
    function openModal() {
        document.getElementById("file").value = "";
        setErrors(null);
        modalRef.current.show();
    }

    // Close modal and reset state
    function closeModal() {
        setFile(null);
        setErrors(null);
    }

    // Hook modal open/close methods to parent component
    useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));

    // File input change handler
    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Submit import form
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        AxiosInstance.post("payment/import", formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                router.visit("/payment");
                modalRef.current.close();
                Swal.fire({
                    position: "top-end",
                    title: "Import File",
                    text: `${response.data}`,
                    icon: "success",
                    width: "400px",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error("Unexpected error:", error);
                }
            });
    };

    return (
        <Modal
            id="importPayment"
            title={<h4 className="m-0 mt-2">Import Payment</h4>}
            modalSize="modal-lg"
            ref={modalRef}
            footer={
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                >
                    Submit
                </button>
            }
            closeModal={closeModal}
            closeModalButton={() => false}
        >
            <form className="form-group required">
                <div className="gy-2">
                    <div className="mb-3">
                        <h5 className="form-label control-label ms-1">File</h5>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={handleChange}
                            className="form-control"
                        />
                        {/* Single field validation error */}
                        {errors?.file && (
                            <div className="text-danger mt-1">
                                {errors.file[0]}
                            </div>
                        )}

                        {/* Bulk/row-level validation errors */}
                        {errors && !errors.file && Array.isArray(errors) && (
                            <div className="table table-responsive mt-4">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th
                                                colSpan="3"
                                                className="text-center"
                                                style={{ backgroundColor: "#ffbaba" }}
                                            >
                                                Errors
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="col">Row</th>
                                            <th scope="col">Attribute</th>
                                            <th scope="col">Errors</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {errors.map((error, index) => (
                                            <tr key={index}>
                                                <td>{error.row}</td>
                                                <td>{error.attribute}</td>
                                                <td>
                                                    {error.errors.map((msg, i) => (
                                                        <h6 key={i} className="text-danger">{msg}</h6>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default ImportForm;
