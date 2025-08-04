import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import Modal from "../../components/Modal.jsx";
import DataTable from "../../components/DataTable.jsx";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import Excel from "../../components/Excel.jsx";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import dayjs from "dayjs";

const BalanceList = forwardRef(function BalanceList(props, ref) {
    let modalRef = useRef(null);
    const [data, setData] = useState({});
    const [fields, setFields] = useState([]);
    const [range, setRange] = useState({});
    const columns = [
        { key: "id", name: "ID" },
        { key: "credit", name: "Credit" },
        { key: "debit", name: "Debit" },
        { key: "balance", name: "Balance" },
        { key: "transaction_at", name: "Date" },
        {
            key: "type",
            name: "Type",
            renderBody: ({ column, row, index }) => {
                return row.type === 0
                    ? "Cup List Transaction"
                    : "Payment Transaction";
            },
        },
    ];
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_page: 0,
    });

    useEffect(() => {
        loadData();
    }, [pagination.per_page]);

    function openModal(name, balance, id) {
        setData({
            vendor_name: name,
            vendor_balance: balance,
            vendor_id: id,
        });
        modalRef.current.show();
    }

    useEffect(() => {
        loadData();
    }, [data.vendor_id]);

    const submitWithRange = () => {
        let data = {};
        if (range[1] != null) {
            data.start = dayjs(range[0]).format("YYYY-MM-DD");
            data.end = dayjs(range[1]).format("YYYY-MM-DD");
        }
        return data ? data : null;
    };

    function loadData(page = 1) {
        let filterData = {
            page_number: page,
            per_page_number: pagination.per_page,
            id: data.vendor_id,
            range: submitWithRange(),
        };
        AxiosInstance({
            method: "post",
            url: "/vendor/get-transactions",
            data: filterData,
        })
            .then((response) => {
                setFields(response.data.data);
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

    function closeModal() {
        setData({});
        setFields([]);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    return (
        <>
            <Modal
                id="balanceView"
                title={data.vendor_name}
                modalSize="modal-lg"
                ref={modalRef}
                closeModal={closeModal}
                closeModalButton={() => {
                    return false;
                }}
            >
                <div className="d-flex justify-content-between mb-1">
                    <h3 className="m-0 d-flex">
                        Balance :
                        {data.vendor_balance < 0 ? (
                            <p className="m-0 text-danger ms-1">
                                {data.vendor_balance}
                            </p>
                        ) : (
                            <p className="m-0 text-success ms-1">
                                {data.vendor_balance}
                            </p>
                        )}
                    </h3>
                    <div className="d-flex align-items-center">
                        <Calendar
                            placeholder="Date Range"
                            style={{ height: 38 }}
                            selectionMode="range"
                            value={range}
                            onChange={(e) => setRange(e.value)}
                            readOnlyInput
                            hideOnRangeSelection
                        />
                        <button
                            type="button"
                            className="btn btn-outline-success ms-1 me-2"
                            onClick={() => loadData()}
                        >
                            Apply
                        </button>
                        <Excel
                            Export={
                                <a
                                    href="vendor/export-transaction"
                                    type="button"
                                    className="dropdown-item"
                                >
                                    Download Excel
                                </a>
                            }
                            demo={true}
                        />
                        <a
                            type="button"
                            className="btn btn-outline-primary ms-1"
                            href={`vendor/download-transactions/${data.vendor_id}`}
                            target="_blank"
                        >
                            PDF
                        </a>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    rows={fields}
                    loadData={loadData}
                    pagination={pagination}
                    setPagination={setPagination}
                    perPageNumbers={[2, 5, 10, 25]}
                />
            </Modal>
        </>
    );
});

export default BalanceList;
