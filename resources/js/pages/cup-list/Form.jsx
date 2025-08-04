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
import ProductCard from "./ProductCard.jsx";
import AxiosInstance from "../../components/AxiosInstance.jsx";

const Form = forwardRef(function Form(props, ref) {
    let modalRef = useRef(null);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [titleText, setTitleText] = useState("");
    const [defaultData, setDefaultData] = useState({
        id: null,
        vendor_id: "",
        entry_at: "",
        total_cups: "",
        total_amount: "",
        remark: "",
        cup_list: [],
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
        entry_at: "",
        total_cups: "",
        total_amount: "",
        remark: "",
        cup_list: [],
    });

    useEffect(() => {
        getVendors();
    }, []);

    useEffect(() => {
        setCupList();
    }, [products]);

    useEffect(() => {
        if (fields.cup_list.length > 0 && fields.cup_list[0].price != "") {
            let cups = 0;
            let amount = 0;

            fields.cup_list.forEach((cup_list, index) => {
                cups += Number(cup_list.cups);
                amount += cup_list.price * cup_list.cups;
            });

            setFields({
                ...fields,
                total_amount: amount,
                total_cups: cups,
            });
        }
    }, [fields.cup_list]);

    const openModal = async (name, cupList) => {
        if (cupList) {
            if (cupList.id) {
                cupList.entry_at = dayjs(cupList.entry_at).format(
                    "YYYY-MM-DD HH:mm"
                );
                setFields(cupList);
                setDefaultData(cupList);
                setTitleText(name);
            } else {
                cupList.entry_at = await dayjs().format("YYYY-MM-DD HH:mm");
                setFields(cupList);
                setDefaultData(cupList);
            }
        }
        modalRef.current.show();
    };

    function closeModal() {
        setFields({
            id: null,
            vendor_id: "",
            entry_at: "",
            total_cups: "",
            total_amount: "",
            remark: "",
            cup_list: [],
        });
        setDefaultData({
            id: null,
            vendor_id: "",
            entry_at: "",
            total_cups: "",
            total_amount: "",
            remark: "",
            cup_list: [
                {
                    id: null,
                    product_id: "",
                    price: "",
                    cups: "",
                },
            ],
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
        if (defaultData.remark == null) {
            setDefaultData({ ...defaultData, remark: "" });
        }
    };

    const vendorChange = async (value) => {
        if (
            fields.id !== null &&
            fields.vendor_id == defaultData.vendor_id &&
            fields.cup_list == defaultData.cup_list
        ) {
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
                    text: "You won't to change the vendor? if you change the vendor, all products will be reset.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        setFields({
                            ...fields,
                            vendor_id: value,
                            cup_list: [],
                        });
                        await getProducts(value);
                    }
                });
        } else {
            setFields({
                ...fields,
                vendor_id: value,
                cup_list: [],
            });
            await getProducts(value);
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

        let data = fields;
        let cupList = [...fields.cup_list];

        data.cup_list = cupList.filter((a) => a.cups != 0);

        let title = data.id ? "Updated" : "Created";
        let url = data.id
            ? `/cup-list/store-or-update/${data.id}`
            : "/cup-list/store-or-update";

        AxiosInstance({
            method: "post",
            url: url,
            data: data,
        })
            .then((response) => {
                router.visit("/cup-list");
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
    }

    function getVendors() {
        AxiosInstance({
            method: "get",
            url: "/cup-list/get-vendors",
        })
            .then((response) => {
                setVendors(response.data);
            })
            .catch(function (error) {
                setError(error.response.data.errors);
            });
    }

    function getProducts(vendor_id) {
        vendor_id != "" &&
            AxiosInstance({
                method: "get",
                url: `/cup-list/get-products/${vendor_id}`,
            })
                .then((response) => {
                    setProducts(response.data);
                })
                .catch(function (error) {
                    setError(error.response.data.errors);
                });
    }

    const setCupList = async () => {
        let cupList = [];
        products.forEach((product, index) => {
            cupList.push({
                id: null,
                name: product.name,
                product_id: product.id,
                price: product.price,
                cups: 0,
            });
        });
        cupList.length > 0 && setFields({ ...fields, cup_list: cupList });
    };

    function changeCupListField(index, value) {
        if (value >= 0) {
            let cupLists = [...fields.cup_list];
            cupLists[index]["cups"] = value;

            setFields({ ...fields, cup_list: cupLists });
        }
    }

    return (
        <Modal
            id="formView"
            title={
                fields.id !== null ? (
                    <div className="d-flex justify-content-between">
                        <h4 className="m-0 mt-2">Update Cup List :</h4>
                        <span className="badge bg-info p-2 ms-2">
                            <h4 className="m-0">{titleText}</h4>
                        </span>
                    </div>
                ) : (
                    <h4 className="m-0 mt-2">Create Cup List</h4>
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
                    <div className="col-6">
                        <div>
                            <h4>
                                Total Cups{" :"}
                                <span className="badge text-bg-secondary ms-2">
                                    <h5 className="p-0 m-0 pt-1">
                                        {fields.total_cups || 0}
                                    </h5>
                                </span>
                            </h4>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <h4>
                                Total Amount{" :"}
                                <span className="badge text-bg-secondary ms-2">
                                    <h5 className="p-0 m-0 pt-1">
                                        {fields.total_amount || 0}
                                    </h5>
                                </span>
                            </h4>
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Vendor
                        </label>
                        <select
                            name="vendor_id"
                            value={fields.vendor_id || ""}
                            onChange={(e) => {
                                vendorChange(e.target.value);
                            }}
                            className={`form-select form-control ${
                                errors.vendor_id ? "is-invalid" : ""
                            }`}
                        >
                            <option value="">Open this select menu</option>
                            {vendors.map((vendor, index) => (
                                <option key={index} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            {errors.vendor_id}
                        </div>
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label control-label">
                            Entry At
                        </label>
                        <input
                            type="datetime-local"
                            name="entry_at"
                            value={fields.entry_at || ""}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.entry_at ? "is-invalid" : ""
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.entry_at}
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Remark</label>
                        <textarea
                            name="remark"
                            value={fields.remark || ""}
                            style={{ height: "10px" }}
                            onChange={handelChange}
                            className={`form-control ${
                                errors.remark ? "is-invalid" : ""
                            }`}
                        ></textarea>
                        <div className="invalid-feedback">{errors.remark}</div>
                    </div>
                    <div className="mt-2">
                        <h4 className="mb-3">Cup List</h4>
                        <div className="d-flex flex-wrap gap-3">
                            {fields.cup_list.map((cupList, index) => (
                                <ProductCard
                                    key={index}
                                    index={index}
                                    cupList={cupList}
                                    changeCupListField={changeCupListField}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
});

export default Form;
