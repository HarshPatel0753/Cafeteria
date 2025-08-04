import { Link, router, useForm } from "@inertiajs/react";
import Card from "../../components/Card.jsx";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { isEqual } from "lodash";
import AxiosInstance from "../../components/AxiosInstance.jsx";

function Form({ vendor }) {
    const [name, setName] = useState(null);
    const [defaultData, setDefaultData] = useState({
        id: null,
        name: "",
        mobile_number: "",
        email: "",
        address: "",
        gst_number: "",
        delivery_persons: [],
        products: [
            {
                id: null,
                name: "",
                price: "",
            },
        ],
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
        mobile_number: "",
        email: "",
        address: "",
        gst_number: "",
        delivery_persons: [],
        products: [
            {
                id: null,
                name: "",
                price: "",
            },
        ],
    });

    useEffect(() => {
        vendor &&
            (setName(vendor.name),
            vendor.delivery_persons.forEach((deliveryPerson) => {
                delete deliveryPerson.vendor_id;
            }),
            vendor.products.forEach((product) => {
                delete product.vendor_id;
            }),
            setFields(vendor),
            setDefaultData(vendor));
    }, []);

    const handelChange = (e) => {
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    function addDeliveryPerson() {
        let data = { ...fields };

        data.delivery_persons.push({
            id: null,
            name: "",
            mobile_number: "",
        });

        setFields(data);
    }

    function changeDeliveryPersonField(e, index) {
        const { value, name } = e.target;

        let deliveryPersons = [...fields.delivery_persons];
        deliveryPersons[index][name] = value;

        setFields({ ...fields, delivery_persons: deliveryPersons });
    }

    function deleteDeliveryPersonField(index) {
        let deliveryPersons = [...fields.delivery_persons];

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
                text: "You won't to delete this data?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    let changed_delivery_persons = deliveryPersons.filter(
                        (a, i) => i !== index
                    );
                    setFields({
                        ...fields,
                        delivery_persons: changed_delivery_persons,
                    });
                }
            });
    }

    function addProduct() {
        let data = { ...fields };

        data.products.push({
            id: null,
            name: "",
            price: "",
        });

        setFields(data);
    }

    function changeProductField(e, index) {
        const { value, name } = e.target;

        let Products = [...fields.products];
        Products[index][name] = value;

        setFields({ ...fields, products: Products });
    }

    function deleteProductField(index) {
        let Products = [...fields.products];

        if (Products.length == 1) {
            Swal.fire({
                position: "top-end",
                title: "Deleted!",
                text: "You can't delete this field minimum 1 Product required.",
                icon: "error",
                width: "400px",
                showConfirmButton: false,
                timer: 2000,
            });
        } else {
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
                    text: "You won't to delete this data?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        let changed_products = Products.filter(
                            (a, i) => i !== index
                        );
                        setFields({
                            ...fields,
                            products: changed_products,
                        });
                    }
                });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();
        let title = fields.id ? "Updated" : "Created";
        let url = fields.id
            ? `/vendor/store-or-update/${fields.id}`
            : "/vendor/store-or-update";
        // let url = fields.id
        //     ? `http://127.0.0.1:8000/vendor/store-or-update/${fields.id}`
        //     : "http://127.0.0.1:8000/vendor/store-or-update";
        AxiosInstance({
            method: "post",
            url: url,
            data: fields,
        })
            .then((response) => {
                router.visit("/vendor");
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
        //         router.visit("/vendor");
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

    function handleCancel() {
        if (isEqual(fields, defaultData)) {
            router.visit("/vendor");
        } else {
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
                        router.visit("/vendor");
                    }
                });
        }
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <Link
                        className="breadcrumb-item"
                        aria-current="page"
                        href="/vendor"
                    >
                        Vendors
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Form
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={
                    fields.id !== null ? (
                        <div className="d-flex justify-content-between">
                            <h4 className="m-0 mt-2">Update Vendor :</h4>
                            <span className="badge bg-info p-2 ms-2">
                                <h4 className="m-0">{name}</h4>
                            </span>
                        </div>
                    ) : (
                        <h4 className="m-0 mt-2">Create Vendor</h4>
                    )
                }
            >
                <form className="form-group required">
                    <div className="row gy-2">
                        <div className="col-6 mb-3">
                            <label
                                htmlFor="name"
                                className="form-label control-label"
                                required
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={fields.name || ""}
                                onChange={handelChange}
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                            />
                            <div className="invalid-feedback">
                                {errors.name}
                            </div>
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
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
                            <div className="invalid-feedback">
                                {errors.email}
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label control-label">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={fields.address || ""}
                                onChange={handelChange}
                                className={`form-control ${
                                    errors.address ? "is-invalid" : ""
                                }`}
                            ></textarea>
                            <div className="invalid-feedback">
                                {errors.address}
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label">GST-Number</label>
                            <input
                                type="text"
                                name="gst_number"
                                value={fields.gst_number || ""}
                                onChange={handelChange}
                                maxLength={15}
                                className={`form-control ${
                                    errors.gst_number ? "is-invalid" : ""
                                }`}
                            />
                            <div className="invalid-feedback">
                                {errors.gst_number}
                            </div>
                        </div>
                    </div>
                    <div className="row g-2">
                        <div className="col-12 m-0">
                            <div className="d-flex justify-content-between mb-2">
                                <h4 className="m-0 mt-2">Delivery Persons</h4>
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() => addDeliveryPerson()}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr. No.</th>
                                            <th
                                                scope="col"
                                                className="control-label"
                                            >
                                                Name
                                            </th>
                                            <th scope="col">Mobile Number</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fields.delivery_persons.map(
                                            (delivery_person, index) => (
                                                <tr
                                                    key={index}
                                                    id={index}
                                                    className="align-top"
                                                >
                                                    <th
                                                        className="col-2"
                                                        scope="row"
                                                    >
                                                        {index + 1}
                                                    </th>
                                                    <td className="col-4">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="name"
                                                            value={
                                                                delivery_person.name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                changeDeliveryPersonField(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className={`form-control ${
                                                                errors[
                                                                    `delivery_persons.${index}.name`
                                                                ]
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `delivery_persons.${index}.name`
                                                                ]
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="col-4">
                                                        <input
                                                            type="text"
                                                            placeholder="mobile number"
                                                            name="mobile_number"
                                                            maxLength="10"
                                                            value={
                                                                delivery_person.mobile_number ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                changeDeliveryPersonField(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className={`form-control ${
                                                                errors[
                                                                    `delivery_persons.${index}.mobile_number`
                                                                ]
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </td>
                                                    <td className="col-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => {
                                                                deleteDeliveryPersonField(
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-12 m-0">
                            <div className="d-flex justify-content-between mb-2">
                                <h4 className="m-0 mt-2">Products</h4>
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() => addProduct()}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr. No.</th>
                                            <th
                                                scope="col"
                                                className="control-label"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="control-label"
                                            >
                                                Price
                                            </th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fields.products.map(
                                            (product, index) => (
                                                <tr
                                                    key={index}
                                                    id={index}
                                                    className="align-top"
                                                >
                                                    <th
                                                        className="col-2"
                                                        scope="row"
                                                    >
                                                        {index + 1}
                                                    </th>
                                                    <td className="col-4">
                                                        <input
                                                            type="text"
                                                            placeholder="name"
                                                            name="name"
                                                            value={
                                                                product.name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                changeProductField(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className={`form-control ${
                                                                errors[
                                                                    `products.${index}.name`
                                                                ]
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `products.${index}.name`
                                                                ]
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="col-4">
                                                        <input
                                                            type="text"
                                                            placeholder="price"
                                                            name="price"
                                                            value={
                                                                product.price ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                changeProductField(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className={`form-control ${
                                                                errors[
                                                                    `products.${index}.price`
                                                                ]
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `products.${index}.price`
                                                                ]
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="col-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => {
                                                                deleteProductField(
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-secondary ms-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </>
    );
}

export default Form;
