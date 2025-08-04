import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import AxiosInstance from "../../components/AxiosInstance.jsx";

const Form = forwardRef(function Form(props, ref) {
    let modalRef = useRef(null);
    const [vendors, setVendors] = useState([]);
    const [titleText, setTitleText] = useState("");
    const [defaultData, setDefaultData] = useState({
        id: null,
        vendor_id: "",
        payment_at: "",
        type: "",
        amount: "",
        remark: "",
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
        vendor_id: "",
        payment_at: "",
        type: "",
        amount: "",
        remark: "",
    });

    useEffect(() => {
        getVendors();
    }, []);

    function openModal(name, payment, id) {
        if (payment) {
            payment.payment_at = dayjs(payment.payment_at).format(
                "YYYY-MM-DD HH:mm"
            );
            setFields(payment);
            setDefaultData(payment);
        } else {
            setFields({
                ...fields,
                payment_at: dayjs().format("YYYY-MM-DD HH:mm"),
                vendor_id: id,
            });
            setDefaultData({
                ...defaultData,
                payment_at: dayjs().format("YYYY-MM-DD HH:mm"),
                vendor_id: id,
            });
        }
        if (name) {
            setTitleText(name);
        }
        modalRef.current.show();
    }

    function closeModal() {
        setFields({
            id: null,
            vendor_id: "",
            payment_at: "",
            type: "",
            amount: "",
        });
        setDefaultData({
            id: null,
            vendor_id: "",
            payment_at: "",
            type: "",
            amount: "",
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

        if (name == "vendor_id" && fields.id == null) {
            let balance = 0;
            vendors.forEach((vendor) => {
                if (vendor.id == value) {
                    balance = Math.abs(vendor.balance);
                }
            });
            setFields({ ...fields, [name]: value, amount: balance });
        } else {
            setFields({ ...fields, [name]: value });
        }
        if (defaultData.remark == null) {
            setDefaultData({
                ...defaultData,
                remark: "",
            });
        }
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
        let title = fields.id ? "Updated" : "Created";
        let url = fields.id
            ? `payment/store-or-update/${fields.id}`
            : "payment/store-or-update";
        // let url = fields.id
        //     ? `http://127.0.0.1:8000/payment/store-or-update/${fields.id}`
        //     : "http://127.0.0.1:8000/payment/store-or-update";
        AxiosInstance({
            method: "post",
            url: url,
            data: fields,
        })
            .then((response) => {
                router.visit("/payment");
                modalRef.current.close();
                Swal.fire({
                    position: "top-end",
                    title: `${title}`,
                    text: `${response.data.message}`,
                    icon: "success",
                    width: "400px",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch(function (error) {
                setError(error.response.data.errors);
            });

        // axios
        //     .post(url, fields)
        //     .then(function (response) {
        //         router.visit("/payment");
        //         modalRef.current.close();
        //         Swal.fire({
        //             position: "top-end",
        //             title: `${title}`,
        //             text: `${response.data.message}`,
        //             icon: "success",
        //             width: "400px",
        //             showConfirmButton: false,
        //             timer: 2000,
        //         });
        //     })
        //     .catch(function (error) {
        //         setError(error.response.data.errors);
        //     });
    }

    function getVendors() {
        AxiosInstance({
            method: "get",
            url: "/payment/get-vendors",
        })
            .then((response) => {
                setVendors(response.data);
            })
            .catch(function (error) {
                setError(error.response.data.errors);
            });

        // axios
        //     .get("http://127.0.0.1:8000/payment/get-vendors")
        //     .then(function (response) {
        //         setVendors(response.data);
        //     })
        //     .catch(function (error) {
        //         setError(error.response.data.errors);
        //     });
    }

    return (
        <Modal
            id={"payment"}
            title={
                fields.id !== null ? (
                    <div className="d-flex justify-content-between">
                        <h4 className="m-0 mt-2">Update Payment :</h4>
                        <span className="badge bg-info p-2 ms-2">
                            <h4 className="m-0">{titleText}</h4>
                        </span>
                    </div>
                ) : (
                    <h4 className="m-0 mt-2">Create Payment</h4>
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
                            Vendor
                        </label>
                        <select
                            name="vendor_id"
                            value={fields.vendor_id || ""}
                            onChange={(e) => {
                                handelChange(e);
                            }}
                            className={`form-select form-control ${
                                errors.vendor_id ? "is-invalid" : ""
                            }`}
                        >
                            <option value="">Open this select menu</option>
                            {vendors.map((vendor, index) => (
                                <option key={index} value={vendor.id}>
                                    {`${vendor.name} -`}{" "}
                                    {` Rs. ${vendor.balance}`}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            {errors.vendor_id}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Payment At
                        </label>
                        <input
                            type="datetime-local"
                            name="payment_at"
                            value={fields.payment_at || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.payment_at ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.payment_at}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">Type</label>
                        <select
                            name="type"
                            value={fields.type}
                            onChange={handelChange}
                            className={`form-select form-control ${
                                errors.type ? "is-invalid" : ""
                            }`}
                        >
                            <option value="">Open this select menu</option>
                            <option value={0}>Credit</option>
                            <option value={1}>Debit</option>
                        </select>
                        <div className="invalid-feedback">{errors.type}</div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            min={1}
                            value={fields.amount || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.amount ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">{errors.amount}</div>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Remark</label>
                        <textarea
                            name="remark"
                            value={fields.remark || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.remark ? "is-invalid" : ""
                            }`}
                        ></textarea>
                        <div className="invalid-feedback">{errors.remark}</div>
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default Form;
