import { useEffect, useRef, useState } from "react";
import Form from "./Form";
import Card from "../../components/Card.jsx";
import { Link, router } from "@inertiajs/react";
import DataTable from "../../components/DataTable.jsx";
import Swal from "sweetalert2";
import DeliveryPersonsList from "./DeliveryPersonsList.jsx";
import ProductsList from "./ProductsList.jsx";
import BalanceList from "./BalanceList.jsx";
import Details from "./Details.jsx";
import AxiosInstance from "../../components/AxiosInstance.jsx";

function Index() {
    const [vendors, setVendors] = useState([]);
    const columns = [
        {
            key: "sr_no",
            name: "Sr. No.",
            renderBody: ({ column, row, index }) => {
                return <>{index + 1}</>;
            },
        },
        { key: "name", name: "Name" },
        { key: "mobile_number", name: "Mobile Number" },
        { key: "email", name: "Email" },
        {
            key: "balance",
            name: "Balance",
            renderBody: ({ column, row, index }) => {
                const name = (
                    <h4 className="m-0 mt-1">
                        Transactions :
                        <span className="badge bg-primary p-2 ms-2">
                            <h5 className="m-0 p-0">{row.name}</h5>
                        </span>
                    </h4>
                );
                const balance = row.balance;
                return (
                    <>
                        <button
                            type="button"
                            className={
                                balance < 0
                                    ? `btn btn-outline-danger`
                                    : `btn btn-outline-success`
                            }
                            title="View Products"
                            onClick={() =>
                                openBalanceModal(name, balance, row.id)
                            }
                        >
                            {balance}
                        </button>
                    </>
                );
            },
        },
        {
            key: "action",
            name: "Action",
            renderBody: ({ column, row }) => {
                let name = row.name;
                const detailsName = (
                    <h5>
                        Vendors Details :
                        <span className="badge bg-primary p-2 ms-2">
                            <h5 className="m-0 p-0">{name}</h5>
                        </span>
                    </h5>
                );
                return (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline-primary ms-1"
                            onClick={() => {
                                openDetailsModal(detailsName, row);
                            }}
                        >
                            <i className="fas fa-eye"></i>
                        </button>
                        <Link
                            type="button"
                            className="btn btn-outline-success ms-1"
                            href={`/vendor/update-form/${row.id}`}
                        >
                            <i className="fas fa-edit"></i>
                        </Link>
                        <button
                            type="button"
                            className="btn btn-outline-danger ms-1"
                            onClick={() => {
                                destroy(row.id);
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
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

    let balanceListRef = useRef(null);
    let openDetailsRef = useRef(null);

    function openDetailsModal(name, row) {
        openDetailsRef.current.openModal(name, row);
    }

    function openBalanceModal(name, balance, id) {
        balanceListRef.current.openModal(name, balance, id);
    }

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    function loadData(page = 1) {
        AxiosInstance({
            method: "post",
            url: `/vendor/load-data/${pagination.per_page}/${page}`,
        })
            .then((response) => {
                setVendors(response.data.data);
                setPagination({
                    ...pagination,
                    total_page: response.data.last_page,
                    current_page: page,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        // axios
        //     .post(
        //         `http://127.0.0.1:8000/vendor/load-data/${pagination.per_page}/${page}`
        //     )
        //     .then(function (response) {
        //         setVendors(response.data.data);
        //         setPagination({
        //             ...pagination,
        //             total_page: response.data.last_page,
        //             current_page: page,
        //         });
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
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
                        url: `/vendor/destroy/${id}`,
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
                                timer: 1000,
                            });
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    // axios
                    //     .get(`http://127.0.0.1:8000/vendor/destroy/${id}`)
                    //     .then(function () {
                    //         loadData(pagination.current_page);
                    //         Swal.fire({
                    //             position: "top-end",
                    //             title: "Deleted",
                    //             text: "Your data has been Deleted.",
                    //             icon: "success",
                    //             width: "400px",
                    //             showConfirmButton: false,
                    //             timer: 1000,
                    //         });
                    //     })
                    //     .catch(function (error) {
                    //         console.log(error);
                    //     });
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
                        Vendors
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<h2>Vendors</h2>}
                headerRight={
                    <Link className="btn btn-outline-dark" href="/vendor/form">
                        Add Vendors
                    </Link>
                }
            >
                <DataTable
                    columns={columns}
                    rows={vendors}
                    loadData={loadData}
                    pagination={pagination}
                    setPagination={setPagination}
                    perPageNumbers={[2, 5, 10, 25]}
                />
            </Card>

            <BalanceList ref={balanceListRef} />
            <Details ref={openDetailsRef}></Details>
        </>
    );
}

export default Index;
