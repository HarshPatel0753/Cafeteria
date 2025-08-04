import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import { isEqual } from "lodash";
import AxiosInstance from "../../components/AxiosInstance.jsx";

const Form = forwardRef(function Form(props, ref) {
    let modalRef = useRef(null);
    const { url } = usePage().props;
    const [roles, setRoles] = useState([]);
    const [titleText, setTitleText] = useState("");
    const [defaultData, setDefaultData] = useState({
        id: null,
        role_id: "",
        username: "",
        first_name: "",
        mobile_number: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
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
        role_id: "",
        username: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    useEffect(() => {
        getRoles();
    }, []);

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
            role_id: "",
            username: "",
            first_name: "",
            last_name: "",
            mobile_number: "",
            email: "",
            password: "",
            confirm_password: "",
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
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
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
        console.log('gfdg');
        let title = fields.id ? "Updated" : "Created";
        let fullUrl = fields.id
            ? `user/store-or-update/${fields.id}`
            : `user/store-or-update`;
        // let fullUrl = fields.id
        //     ? `${url}/store-or-update/${fields.id}`
        //     : `${url}/store-or-update`;
        AxiosInstance({
            method: "post",
            url: fullUrl,
            data: fields,
        })
            .then((response) => {
                props.loadData(props.current_page);
                // router.visit("/user");
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
        // axios
        //     .post(fullUrl, fields)
        //     .then(function () {
        //         props.loadData(props.current_page);
        //         // router.visit("/user");
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
        //     });
    }

    function getRoles() {
        AxiosInstance({
            method: "get",
            url: "user/get-roles",
        })
            .then((response) => {
                setRoles(response.data);
            })
            .catch(function (error) {
                setError(error.response.data.errors);
            });
        // axios
        //     .get(`${url}/get-roles`)
        //     .then(function (response) {
        //         setRoles(response.data);
        //     })
        //     .catch(function (error) {
        //         setError(error.response.data.errors);
        //     });
    }

    return (
        <Modal
            title={
                fields.id !== null ? (
                    <div className="d-flex justify-content-between">
                        <h4 className="m-0 mt-2">Update User :</h4>
                        <span className="badge bg-info p-2 ms-2">
                            <h4 className="m-0">{titleText}</h4>
                        </span>
                    </div>
                ) : (
                    <h4 className="m-0 mt-2">Create User</h4>
                )
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
                        <label className="form-label control-label">Role</label>
                        <select
                            name="role_id"
                            value={fields.role_id || ""}
                            onChange={handelChange}
                            className={`form-select form-control ${
                                errors.role_id ? "is-invalid" : ""
                            }`}
                        >
                            <option value="">Open this select menu</option>
                            {roles.map((role, index) => (
                                <option key={index} value={role.id}>
                                    {role.display_name}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{errors.role_id}</div>
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
                        <label
                            className={
                                !fields.id
                                    ? `form-label control-label`
                                    : `form-label`
                            }
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={fields.password || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.password ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label
                            className={
                                !fields.id
                                    ? `form-label control-label`
                                    : `form-label`
                            }
                        >
                            Confirm Password
                        </label>
                        <input
                            type="text"
                            name="confirm_password"
                            value={fields.confirm_password || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.confirm_password ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.confirm_password}
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default Form;
