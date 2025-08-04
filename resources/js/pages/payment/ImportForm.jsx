import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { router } from "@inertiajs/react";

const ImportForm = forwardRef(function ImportForm(props, ref) {
    let modalRef = useRef(null);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState(null);

    function openModal() {
        document.getElementById('file').value='';
        modalRef.current.show();
    }

    const handelChange = (e) => {
        setFile(e.target.files[0]);
    };

    function closeModal() {
        setFile(null);
        setErrors(null);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    function handleSubmit(e) {
        e.preventDefault();
        // clearErrors();
        AxiosInstance({
            method: "post",
            url: "payment/import",
            data: { file: file },
            headers: {
                Accept: "application/json",
                "Content-type": "multipart/form-data",
            },
        })
            .then((response) => {
                router.visit("/payment");
                modalRef.current.close();
                Swal.fire({
                    position: "top-end",
                    title: `Import File`,
                    text: `${response.data}`,
                    icon: "success",
                    width: "400px",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch(function (error) {
                setErrors(error.response.data.errors);
            });
    }

    return (
        <Modal
            id={"importPayment"}
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
            closeModalButton={() => {
                return false;
            }}
        >
            {/* <div className="">
                <div className="mb-3">
                    <label className="form-label control-label">File</label>
                    <input
                        type="file"
                        name="profile_image_file"
                        label="User Picture"
                        onChange={() => {}}
                        className={"form-control"}
                    />
                </div>
            </div> */}
            <form className="form-group required">
                <div className="gy-2">
                    <div className="mb-3">
                        <h5 className="form-label control-label ms-1">File</h5>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            label="Import File"
                            onChange={handelChange}
                            className={"form-control"}
                        />
                        {errors && errors.file && (
                            <div className="text-danger mt-1">
                                {errors.file[0]}
                            </div>
                        )}
                            {errors && !errors.file &&
                                <div className="table table-responsive mt-4">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr><th style={{ backgroundColor: '#ffbaba' }} colSpan='3' className="text-center">Errors</th></tr>
                                            <tr>
                                                <th scope="col">Row</th>
                                                <th scope="col">Attribute</th>
                                                <th scope="col">Errors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {errors && errors.map((error, index) => (
                                                <tr key={index}>
                                                    <td>{error.row}</td>
                                                    <td>{error.attribute}</td>
                                                    <td>
                                                        {error.errors.map((subError, i) => (
                                                            <h6 key={i} className="text-danger">{subError}</h6>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default ImportForm;
