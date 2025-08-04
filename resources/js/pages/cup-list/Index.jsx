import { useEffect, useRef, useState } from "react";
import Form from "./Form";
import Card from "../../components/Card.jsx";
import { Link } from "@inertiajs/react";
import TestDataTable from "../../components/TestDataTable.jsx";
import Swal from "sweetalert2";
import Details from "./Details.jsx";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import dayjs from "dayjs";

function Index() {
    const [cupList, setCupList] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({
        id: true,
        vendor_id: true,
        entry_at: true,
        total_cups: true,
        total_amount: true,
        action: true,
    });
    const [searchFields, setSearchFields] = useState([
        { key: "id", name: "Id", value: true },
        { key: "vendor_id", name: "Vendor", value: true },
        { key: "entry_at", name: "Entry At", value: true },
        { key: "total_cups", name: "Total Cups", value: true },
        { key: "total_amount", name: "Total Amount", value: true },
    ]);
    const [range, setRange] = useState({});
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
                return <>{row.vendors.name}</>;
            },
        },
        { key: "entry_at", name: "Entry At" },
        { key: "total_cups", name: "Total Cups" },
        { key: "total_amount", name: "Total Amount" },
        {
            key: "action",
            name: "Action",
            alwaysShow: true,
            renderBody: ({ column, row }) => {
                let name = row.vendors.name;
                const detailsName = (
                    <h5>
                        Cup List Details :
                        <span className="badge bg-primary p-2 ms-2">
                            <h5 className="m-0 p-0">{name}</h5>
                        </span>
                    </h5>
                );
                return (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                                openDetailsModal(detailsName, row);
                            }}
                        >
                            <i className="fas fa-eye"></i>
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-success ms-1"
                            onClick={() => {
                                row.is_editable == 1 &&
                                    editCupList(name, row.id);
                            }}
                            disabled={row.is_editable == 0 ? true : false}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
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

    let formRef = useRef(null);
    let openDetailsRef = useRef(null);

    function openCupListForm(name = null, cupList = null) {
        formRef.current.openModal(name, cupList);
    }

    function openDetailsModal(name, cupList) {
        openDetailsRef.current.openModal(name, cupList);
    }

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    const submitSearchFields = (text) => {
        console.log(text);
        let searchArray = [];
        text != "" &&
            searchFields.forEach((row) => {
                if (row.value) {
                    searchArray.push({ name: row.key, text: text });
                }
            });
        loadData(1, searchArray);
    };

    const submitWithRange = () => {
        let data = {};
        if (range[1] != null) {
            data.start = dayjs(range[0]).format("YYYY-MM-DD");
            data.end = dayjs(range[1]).format("YYYY-MM-DD");
        }
        return data ? data : null;
    };

    function loadData(page = 1, searchArray = []) {
        const pageDetails = {
            per_page_number: pagination.per_page,
            page_number: page,
            // sorting_columns: sortingColumns,
            search_fields: searchArray,
            range: submitWithRange(),
        };

        AxiosInstance({
            method: "post",
            url: `/cup-list/load-data`,
            data: pageDetails,
        })
            .then((response) => {
                setCupList(response.data.data);
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
        //         `http://127.0.0.1:8000/cup-list/load-data/${pagination.per_page}/${page}`
        //     )
        //     .then(function (response) {
        //         setCupList(response.data.data);
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
                        url: `/cup-list/destroy/${id}`,
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
                            console.log(error);
                        });
                    // axios
                    //     .get(`http://127.0.0.1:8000/cup-list/destroy/${id}`)
                    //     .then(function () {
                    //         loadData(pagination.current_page);
                    //         Swal.fire({
                    //             position: "top-end",
                    //             title: "Deleted",
                    //             text: "Your data has been Deleted.",
                    //             icon: "success",
                    //             width: "400px",
                    //             showConfirmButton: false,
                    //             timer: 2000,
                    //         });
                    //     })
                    //     .catch(function (error) {
                    //         console.log(error);
                    //     });
                }
            });
    }

    const latestCupList = () => {
        AxiosInstance({
            method: "get",
            url: `cup-list/latest-cup-list`,
        })
            .then(function (response) {
                openCupListForm("", response.data.data);
            })
            .catch(function (error) {
                console.log(error.response.data.errors);
            });
    };

    const editCupList = (name, id) => {
        AxiosInstance({
            method: "get",
            url: `cup-list/edit-cup-list/${id}`,
        })
            .then(function (response) {
                let cupList = response.data;
                openCupListForm(name, cupList);
            })
            .catch(function (error) {
                console.log(error.response.data.errors);
            });
    };

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Cup List
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<h2>Cup List</h2>}
                headerRight={
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => latestCupList()}
                    >
                        Add Cup List
                    </button>
                }
            >
                <TestDataTable
                    columns={columns}
                    rows={cupList}
                    loadData={loadData}
                    pagination={pagination}
                    setPagination={setPagination}
                    perPageNumbers={[2, 5, 10, 25]}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    searchFields={searchFields}
                    setSearchFields={setSearchFields}
                    submitSearchFields={submitSearchFields}
                    range={range}
                    setRange={setRange}
                />
            </Card>
            <Form ref={formRef}></Form>
            <Details ref={openDetailsRef}></Details>
        </>
    );
}

export default Index;
