import { useEffect, useRef, useState } from "react";
import Form from "./Form";
import Card from "../../components/Card.jsx";
import { Link, router, usePage } from "@inertiajs/react";
import TestDataTable from "../../components/TestDataTable.jsx";
import Swal from "sweetalert2";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import ImportForm from "./importForm.jsx";
import Excel from "../../components/Excel";

function Index() {
    const [payment, setPayment] = useState([]);
    const { givenPermissions } = usePage().props;

    const [selectedColumns, setSelectedColumns] = useState({
        id: true,
        vendor_id: true,
        payment_at: true,
        type: true,
        amount: true,
        remark: true,
        created_by: true,
        action: true,
    });
    const [searchFields, setSearchFields] = useState([
        { key: "id", name: "Id", value: true },
        { key: "vendor_id", name: "Vendor", value: true },
        { key: "payment_at", name: "Payment At", value: true },
        { key: "type", name: "Type", value: true },
        { key: "amount", name: "Amount", value: true },
        { key: "remark", name: "Remark", value: true },
        { key: "created_by", name: "Created By", value: true },
    ]);
    const columns = [
        {
            key: "id",
            name: "Id",
            renderBody: ({ column, row, index }) => {
                return <>{row.id}</>;
            },
        },
        {
            key: "vendor_id",
            name: "Vendor",
            renderBody: ({ column, row, index }) => {
                let vendorName = row.vendors && row.vendors.name;
                return <>{vendorName}</>;
            },
        },
        { key: "payment_at", name: "Payment At" },
        {
            key: "type",
            name: "Type",
            renderBody: ({ column, row, index }) => {
                return <>{row.type == 0 ? "Credit" : "Debit"}</>;
            },
        },
        { key: "amount", name: "Amount" },
        { key: "remark", name: "Remark" },
        {
            key: "created_by",
            name: "Created By",
            renderBody: ({ column, row, index }) => {
                return <>{row.users.username}</>;
            },
        },
        {
            key: "action",
            name: "Action",
            alwaysShow: true,
            renderBody: ({ column, row }) => {
                let name = row.vendors && row.vendors.name;
                return (
                    <>
                        {givenPermissions.payment_update && (
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() => {
                                    openPaymentForm(name, row);
                                }}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                        {givenPermissions.payment_delete && (
                            <button
                                type="button"
                                className="btn btn-outline-danger ms-1"
                                onClick={() => {
                                    destroy(row.id);
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        )}
                    </>
                );
            },
        },
    ];
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 5,
        total_page: 0,
    });

    let formRef = useRef(null);
    let importFormRef = useRef(null);

    function openPaymentForm(name, payment = null) {
        formRef.current.openModal(name, payment);
    }

    function openImportForm() {
        importFormRef.current.openModal();
    }

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    const submitSearchFields = (text) => {
        let searchArray = [];
        text != "" &&
            searchFields.forEach((row) => {
                if (row.value) {
                    searchArray.push({ name: row.key, text: text });
                }
            });
        loadData(1, searchArray);
    };

    function loadData(page = 1, searchArray = []) {
        const pageDetails = {
            per_page_number: pagination.per_page,
            page_number: page,
            // sorting_columns: sortingColumns,
            search_fields: searchArray,
        };
        AxiosInstance({
            method: "post",
            url: `/payment/load-data`,
            data: pageDetails,
        })
            .then((response) => {
                setPayment(response.data.data);
                setPagination({
                    ...pagination,
                    total_page: response.data.last_page,
                    current_page: page,
                });
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }

    function destroy(id) {
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
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    AxiosInstance({
                        method: "get",
                        url: `/payment/destroy/${id}`,
                    })
                        .then((response) => {
                            loadData(pagination.current_page);
                            Swal.fire({
                                position: "top-end",
                                title: "Deleted",
                                text: "Your data has been Deleted.",
                                icon: "success",
                                width: "400px",
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        })
                        .catch(function (error) {
                            console.log(error.response);
                        });
                }
            });
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Payment
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<h2>Payment</h2>}
                headerRight={
                    <div>
                        <a
                            href="/payment/payment-pdf"
                            target="_blank"
                            type="button"
                            className="btn btn-outline-primary "
                        >
                            PDF
                        </a>
                        <Excel
                            Export={
                                <a
                                    href="/payment/export"
                                    type="button"
                                    className="dropdown-item"
                                >
                                    Download Excel
                                </a>
                            }
                            Import={
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => openImportForm()}
                                >
                                    Import Excel
                                </button>
                            }
                            demo={true}
                        />
                        {givenPermissions.payment_store && (
                            <button
                                type="button"
                                className="btn btn-outline-dark ms-2"
                                onClick={() => openPaymentForm()}
                            >
                                Add Payment
                            </button>
                        )}
                    </div>
                }
            >
                <TestDataTable
                    columns={columns}
                    rows={payment}
                    loadData={loadData}
                    pagination={pagination}
                    setPagination={setPagination}
                    perPageNumbers={[2, 5, 10, 25]}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    searchFields={searchFields}
                    setSearchFields={setSearchFields}
                    submitSearchFields={submitSearchFields}
                />
            </Card>
            <Form ref={formRef} />
            <ImportForm ref={importFormRef} />
        </>
    );
}

export default Index;
