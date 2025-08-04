import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const ImportForm = forwardRef(function ImportForm({ loadData }, ref) {
    const modalRef = useRef(null);

    function openModal() {
        document.getElementById('roleFile').value='';
        modalRef.current.show();
    }

    // useEffect(() => {
    //     openForm()
    // }, []);

    const [rolesFile, setRolesFile] = useState();
    const [errors, setErrors] = useState();

    function importExcel() {
        const formData = new FormData();
        formData.append('role_file', rolesFile);

        AxiosInstance({
            method: "post",
            url: `/role/import`,
            headers: {
                'content-type': 'multipart/form-data',
            },
            data: formData
        })
            .then((response) => {
                console.log(response);
                modalRef.current.close();
                setRolesFile();
                setErrors();
                loadData();
                Swal.fire({
                    position: "top-end",
                    title: `${response.data.message}`,
                    html: `${response.data.status}.`,
                    icon: "success",
                    // width: "400px",
                    showConfirmButton: false,
                    timer: 4000,
                });
            })
            .catch(function (error) {
                // console.log(error.response.data.errors.role_file);
                setErrors(error.response.data.errors);
            });
    }
    // console.log(errors);

    function handelChange(event) {
        // console.log(event.target.files[0]);
        setRolesFile(event.target.files[0]);
    }

    function closeModal() {
        setRolesFile();
        setErrors();
    }

    useImperativeHandle(ref, () => {
        return {
            openModal
        }
    });
    return (
        <>
            <Modal
                title={
                    <div className="d-flex justify-content-between">
                        <h4 className="m-0 mt-2">Import Role</h4>
                    </div>
                }
                modalSize="modal-lg"
                ref={modalRef}
                footer={
                    <button
                        onClick={importExcel}
                        type="submit"
                        className="btn btn-outline-success ms-2"
                    >
                        Submit
                    </button>
                }
                closeModal={closeModal}
                closeModalButton={() => {
                    return false
                }}
            >
                <form className="form-group required">
                    <div className="row col-12 align-items-center">
                        <label className="form-label control-label col-3">
                            Upload File
                        </label>
                        <input
                            type="file"
                            id="roleFile"
                            // name="roleExcelFile"
                            // value={rolesFile}
                            onChange={handelChange}
                            className='form-control '
                        />

                        {/* <div className="mt-2">
                            {errors.map((error, index) => (
                                <h6 key={index} className="text-danger">{error.errors}</h6>
                            ))}
                        </div> */}
                        {errors && errors.role_file &&
                            <h6 className="text-danger mt-2">{errors.role_file}</h6>
                        }
                        {errors && !errors.role_file &&
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
                                        {errors.map((error, index) => (
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
                </form>
            </Modal>
        </>
    );
});



export default ImportForm;
