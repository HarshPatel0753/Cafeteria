import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useForm } from "@inertiajs/react";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import { isEqual } from "lodash";
import AxiosInstance from "../../components/AxiosInstance.jsx";

const Form = forwardRef(function Form(props, ref) {
    let modalRef = useRef(null);
    const [titleText, setTitleText] = useState("");
    const [defaultData, setDefaultData] = useState({
        id: null,
        username: "",
        first_name: "",
        mobile_number: "",
        last_name: "",
        email: "",
        profile_image_file: "",
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
        username: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        email: "",
        profile_image_file: "",
    });

    function openModal(user) {
        if (user) {
            setTitleText(user.username);
            setFields(user);
            setDefaultData(user);
        }
        modalRef.current.show();
    }

    function closeModal() {
        reset();
        setTitleText("");
        clearErrors();
        setDefaultData({
            id: null,
            username: "",
            first_name: "",
            last_name: "",
            mobile_number: "",
            email: "",
            profile_image_file: "",
        });
    }

    function closeModalAlert() {
        if (isEqual(fields, defaultData)) {
            return false;
        } else {
            return true;
        }
    }

    const handelChange = (e) => {
        console.log(e.target.files[0]);
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    const imageHandler = (e) => {
        const { name } = e.target;
        setFields({ ...fields, [name]: e.target.files[0] });
    };

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();
        let title = "Updated";
        AxiosInstance({
            method: "post",
            url: "profile/update-profile/" + fields.id,
            data: fields,
            headers: {
                Accept: "application/json",
                "Content-type": "multipart/form-data",
            },
        })
            .then((response) => {
                props.loadUser();
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
                setError(error.response.data.errors);
            });
    }

    return (
        <Modal
            title={
                <div className="d-flex justify-content-between">
                    <h4 className="m-0 mt-2">Update Profile :</h4>
                    <span className="badge bg-info p-2 ms-2">
                        <h4 className="m-0">{titleText}</h4>
                    </span>
                </div>
            }
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
            closeModalButton={closeModalAlert}
        >
            <form className="form-group required">
                <div className="row gy-2">
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={fields.username || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.username ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.username}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={fields.email || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.email ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">{errors.email}</div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={fields.first_name || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.first_name ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.first_name}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={fields.last_name || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.last_name ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.last_name}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            name="mobile_number"
                            value={fields.mobile_number || ""}
                            maxLength="10"
                            onChange={handelChange}
                            className={`form-control ${
                                errors.mobile_number ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.mobile_number}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">File</label>
                        <input
                            type="file"
                            name="profile_image_file"
                            label="User Picture"
                            onChange={imageHandler}
                            className={"form-control"}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default Form;

// let data = new FormData();

// 		data.append("id", fields.id);
// 		data.append("username", fields.username);
// 		data.append("first_name", fields.first_name);
// 		data.append("last_name", fields.last_name);
// 		data.append("email", fields.email);
// 		data.append("mobile_number", fields.mobile_number);
// 		image.uri &&
// 			data.append("profile_image_file", {
// 				uri: image.uri,
// 				type: image.mimeType,
// 				name: image.fileName,
// 			});

// 		AxiosInstance({
// 			method: "post",
// 			url: `profile/update-profile/${fields.id}`,
// 			headers: {
// 				Accept: "application/json",
// 				"Content-type": "multipart/form-data",
// 			},
// 			data: data,
// 		})
// 			.then((response) => {
// 				console.log(response.data);
// 				loadData();
// 				close();
// 			})
// 			.catch(function (error) {
// 				console.log(error.response.data);
// 			});
