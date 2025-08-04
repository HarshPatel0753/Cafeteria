import { router, useForm } from "@inertiajs/react";
import Modal from "../../components/Modal.jsx";
import { isEqual } from "lodash";
import Swal from "sweetalert2";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import AxiosInstance from "../../components/AxiosInstance.jsx";


const Form = forwardRef(function Form(props, ref) {
    let modalRef = useRef(null);
    const [titleText, setTitleText] = useState(null);
    const [defaultData, setDefaultData] = useState({
        id: null,
        name: "",
        display_name: "",
    });

    const {
        data: fields,
        setData: setFields,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm({
        id: null,
        name: "",
        display_name: "",
    });

    function openModal(role) {
        if (role) {
            setTitleText(role.display_name);
            setDefaultData(role);
            setFields(role);
        }
        modalRef.current.show();
    }

    function closeModal() {
        setFields({
            id: null,
            name: "",
            display_name: ""
        });
        setDefaultData({
            id: null,
            name: "",
            display_name: ""
        });
        clearErrors();
    }
    function closeModalAlert() {
        if (isEqual(fields, defaultData)) {
            return false;
        } else {
            return true;
        }
    }


    const handelChange = (e) => {
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal
        }
    })

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();
        let title = fields.id ? "Updated" : "Created";
        let url = fields.id
            ? `/role/store-or-update/${fields.id}`
            : "/role/store-or-update";
        // let url = fields.id
        //     ? `http://127.0.0.1:8000/role/store-or-update/${fields.id}`
        //     : "http://127.0.0.1:8000/role/store-or-update";
        AxiosInstance({
			method: "post",
			url: url,
            data:fields
		})
			.then((response) => {
				router.visit("/role");
                modalRef.current.close();
                Swal.fire({
                    position: "top-end",
                    title: `${title}`,
                    html: `Your <mark> data </mark> has been successfully ${title}.`,
                    icon: "success",
                    // width: "400px",
                    showConfirmButton: false,
                    timer: 2000,
                });
			})
			.catch(function (error) {
				console.log(error);
                setError(error.response.data.errors);
			});
        // axios
        //     .post(url, fields)
        //     .then(function () {
        //         router.visit("/role");
        //         modalRef.current.close();
        //         Swal.fire({
        //             position: "top-end",
        //             title: `${title}`,
        //             html: `Your <mark> data </mark> has been successfully ${title}.`,
        //             icon: "success",
        //             // width: "400px",
        //             showConfirmButton: false,
        //             timer: 2000,
        //         });
        //     })
        //     .catch(function (error) {
        //         setError(error.response.data.errors);
        //         console.log(error);
        //     });
    }

    return (
        <>
            <Modal
                id={"roleForm"}
                title={
                    fields.id != null ? (
                        <div className="d-flex justify-content-between">
                            <h4 className="m-0 mt-2">Update Role :</h4>
                            <span className="badge bg-info p-2 ms-2">
                                <h4 className="m-0">{titleText}</h4>
                            </span>
                        </div>
                    ) : (
                        <h4 className="m-0 mt-2">Create Role</h4>
                    )
                }
                modalSize="modal-lg"
                closeModal={closeModal}
                closeModalButton={closeModalAlert}
                ref={modalRef}
                footer={
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >submit</button>
                }
            >
                <form className="form-group required">
                    <div className="row gy-2">
                        <div className="col-6 mb-3">
                            <label className="form-label control-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={fields.name || ""}
                                className={`form-control
                                    ${errors.name ? "is-invalid" : ""
                                    }`}
                                onChange={handelChange}
                            />
                            <div className="invalid-feedback">
                                {errors.name}
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label control-label">Display Name</label>
                            <input
                                type="text"
                                name="display_name"
                                value={fields.display_name || ""}
                                className={`form-control
                                    ${errors.display_name ? "is-invalid" : ""
                                    }`}
                                onChange={handelChange}
                            />
                            <div className="invalid-feedback">
                                {errors.display_name}
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
});

export default Form
