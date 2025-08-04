import { Link, usePage } from "@inertiajs/react";
import Card from "../../components/Card";
import Form from "./Form";
import { useEffect, useRef, useState } from "react";
import DataTable from "../../components/DataTable";
import Swal from "sweetalert2";
import AxiosInstance from "../../components/AxiosInstance";
import Modal from "../../components/Modal";
import ImportForm from "./ImportForm";
import Excel from "../../components/Excel";

function Index() {
    const [roles, setRoles] = useState([]);
    const { givenPermissions } = usePage().props;
    const columns = [
        {
            key: "sr_no",
            name: "Sr. No.",
            renderBody: ({ index }) => {
                return <>{index + 1}</>;
            },
        },
        { key: "name", name: "Name" },
        { key: "display_name", name: "Display Name" },
        {
            key: "action",
            name: "Action",
            renderBody: ({ column, row }) => {
                return (
                    <>
                        {givenPermissions.role_update && (
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() => {
                                    openRoleForm(row);
                                }}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                        {givenPermissions.role_delete && (
                            <button
                                type="button"
                                className="btn btn-outline-danger ms-1"
                                onClick={() => {
                                    destroy(row);
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

    const openRoleForm = (role = null) => {
        formRef.current.openModal(role);
    };

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    function loadData(page = 1) {
        AxiosInstance({
            method: "post",
            url: `/role/load-data/${pagination.per_page}/${page}`,
        })
            .then((response) => {
                setRoles(response.data.data);
                setPagination({
                    ...pagination,
                    total_page: response.data.last_page,
                    current_page: page,
                });
            })
            .catch(function (error) {
                console.log(error.response);
            });

        // axios
        //     .post(
        //         `http://127.0.0.1:8000/role/load-data/${pagination.per_page}/${page}`
        //     )
        //     .then(function (response) {
        //         // console.log(response);
        //         setRoles(response.data.data);
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

    function destroy(role) {
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
                html: `You want to delete user <mark> ${role.name} </mark> !`,
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
                        url: `/role/destroy/${role.id}`,
                    })
                        .then((response) => {
                            loadData(pagination.current_page);
                        })
                        .catch(function (error) {
                            console.log(error.response);
                        });

                    // axios
                    //     .get(`http://127.0.0.1:8000/role/destroy/${role.id}`)
                    //     .then(function () {
                    //         loadData(pagination.current_page);
                    //     })
                    //     .catch(function (error) {
                    //         console.log(error);
                    //     });
                    Swal.fire({
                        position: "top-end",
                        title: "Deleted",
                        text: "Your data has been Deleted.",
                        icon: "success",
                        width: "400px",
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            });
    }

    let importFormRef = useRef(null);

    function openForm() {
        importFormRef.current.openModal();
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Roles
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<b>Roles</b>}
                headerRight={
                    givenPermissions.role_store && (
                        <div>
                            {/* <a
                                href="/role/export"
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Download Excel
                            </a>
                            <button
                                type="button"
                                className="btn btn-outline-success ms-2"
                                onClick={() => openForm()}
                            >
                                Import Role
                            </button> */}
                            <Excel
                                Export={
                                    <a
                                        href="/role/export"
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
                                        onClick={() => openForm()}
                                    >
                                        Import Excel
                                    </button>
                                }
                                demo={true}
                            />
                            {/* <a
                                // href="/role/import"
                                type="button"
                                className="btn btn-outline-success ms-2"
                            >
                                Import Role
                            </a> */}
                            <button
                                type="button"
                                className="btn btn-outline-dark ms-4"
                                onClick={() => {
                                    openRoleForm();
                                }}
                            >
                                Add Role
                            </button>
                        </div>
                    )
                }
            >
                <DataTable
                    columns={columns}
                    rows={roles}
                    loadData={loadData}
                    pagination={pagination}
                    setPagination={setPagination}
                    perPageNumbers={[2, 5, 10, 25]}
                />
            </Card>
            <Form ref={formRef} />
            <ImportForm ref={importFormRef} loadData={loadData} />
        </>
    );
}
export default Index;
