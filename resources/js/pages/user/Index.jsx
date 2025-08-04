import { useEffect, useRef, useState } from "react";
import Form from "./Form";
import Card from "../../components/Card.jsx";
import { Link } from "@inertiajs/react";
import TestDataTable from "../../components/TestDataTable.jsx";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import AxiosInstance from "../../components/AxiosInstance.jsx";

function Index() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 5,
        total_page: 0,
    });

    const [sortingColumns, setSortingColumns] = useState({
        id: "ASC",
    });

    const [selectedColumns, setSelectedColumns] = useState({
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        mobile_number: true,
        email: true,
        role_id: true,
        action: true,
    });

    const [searchFields, setSearchFields] = useState([
        { key: "id", name: "Id", value: true },
        { key: "username", name: "Username", value: true },
        { key: "first_name", name: "First Name", value: true },
        { key: "last_name", name: "Last Name", value: true },
        { key: "mobile_number", name: "Mobile Number", value: true },
        { key: "email", name: "Email", value: true },
    ]);

    const columns = [
        {
            key: "id",
            name: "Id",
            renderBody: ({ column, row, index }) => {
                return <>{row.id}</>;
            },
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "username",
            name: "Username",
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "first_name",
            name: "First Name",
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "last_name",
            name: "Last Name",
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "mobile_number",
            name: "Mobile Number",
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "email",
            name: "Email",
            renderHeader: ({ column, index }) => {
                const columnData = columnHeader(column);
                return columnData;
            },
        },
        {
            key: "role_id",
            name: "Role",
            alwaysShow: true,
            renderBody: ({ column, row }) => {
                return <>{row.roles[0] && row.roles[0].display_name}</>;
            },
            renderHeader: ({ column, index }) => {
                return (
                    <>
                        <a className="btn btn-link text-black w-100 p-2 text-decoration-none">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>{column.name}</div>
                                {/* <i className="fa-solid fa-up-down"></i> */}
                            </div>
                        </a>
                    </>
                );
            },
        },
        {
            key: "action",
            name: "Action",
            alwaysShow: true,
            renderBody: ({ column, row }) => {
                return (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() => {
                                openUserForm(row);
                            }}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger ms-1"
                            onClick={() => {
                                destroy(row);
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </>
                );
            },
            renderHeader: ({ column, index }) => {
                return (
                    <>
                        <a className="btn btn-link text-black w-100 p-2 text-decoration-none">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="">{column.key}</div>
                            </div>
                        </a>
                    </>
                );
            },
        },
    ];

    let formRef = useRef(null);

    function openUserForm(user = null) {
        user != null && (user.role_id = user.roles[0].id);
        formRef.current.openModal(user);
    }

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    useEffect(() => {
        loadData(pagination.current_page);
    }, [sortingColumns]);

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
            sorting_columns: sortingColumns,
            search_fields: searchArray,
        };

        AxiosInstance({
            method: "post",
            url: "user/load-data",
            data: pageDetails,
        })
            .then((response) => {
                setUsers(response.data.data);
                setPagination({
                    ...pagination,
                    total_page: response.data.last_page,
                    current_page: page,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function destroy(user) {
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
                html: `You want to delete user <mark> ${user.username} </mark> !`,
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
                        url: `user/destroy/${user.id}`,
                    })
                        .then((response) => {
                            loadData(pagination.current_page);
                        })
                        .catch(function (error) {
                            console.log(error.response);
                        });

                    // axios
                    //     .get(`${url}/destroy/${user.id}`)
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

    const columnHeader = (column) => {
        let sorting_columns = { ...sortingColumns };
        let key = column.key;
        let icon =
            sorting_columns[key] == undefined
                ? "down-up"
                : sorting_columns[key] == "ASC"
                ? "up"
                : "down";
        let position = null;

        if (Object.keys(sorting_columns).length != 0 && sorting_columns[key]) {
            position = Object.keys(sorting_columns).indexOf(key) + 1;
        }

        if (sorting_columns[key] != undefined) {
            sorting_columns[key] == "ASC"
                ? (sorting_columns[key] = "DESC")
                : delete sorting_columns[key];
        } else {
            sorting_columns[key] = "ASC";
        }

        return (
            <>
                <a
                    className="btn btn-link text-black w-100 p-2 text-decoration-none"
                    onClick={() => {
                        setSortingColumns(sorting_columns);
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>{column.name}</div>
                        <div>
                            {position}
                            {"  "}
                            <i className={`bi bi-arrow-${icon}`}></i>
                        </div>
                    </div>
                </a>
            </>
        );
    };

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Users
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<h2>Users</h2>}
                headerRight={
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => openUserForm()}
                    >
                        Add User
                    </button>
                }
            >
                <TestDataTable
                    columns={columns}
                    rows={users}
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
            <Form
                ref={formRef}
                loadData={loadData}
                current_page={pagination.current_page}
            ></Form>
        </>
    );
}

export default Index;
