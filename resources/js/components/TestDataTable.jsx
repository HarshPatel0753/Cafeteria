import { useState } from "react";
import Pagination from "./Pagination";
import { Calendar } from "primereact/calendar";

function DataTable({
    columns,
    rows,
    loadData,
    pagination,
    setPagination,
    perPageNumbers,
    selectedColumns,
    setSelectedColumns,
    searchFields,
    setSearchFields,
    submitSearchFields,
    range,
    setRange,
}) {
    return (
        <>
            <div className="main">
                {pagination && setPagination && (
                    <div className="header">
                        <div className="d-flex justify-content-between">
                            <div className="left d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                    {rows.length > 0 && <PerPage />}
                                    {rows.length > 0 && <SelectColumns />}
                                </div>
                                {rows.length > 0 && range && (
                                    <div className="d-flex align-items-center ms-4">
                                        <Range />
                                    </div>
                                )}
                            </div>
                            <div className="right d-flex align-items-center">
                                {rows.length > 0 &&
                                    searchFields &&
                                    setSearchFields && <Search />}
                            </div>
                        </div>
                    </div>
                )}
                <div className="body mt-3">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {columns.map(
                                        (column, column_index) =>
                                            selectedColumns[column.key] && (
                                                <th
                                                    key={column_index}
                                                    className="p-0 m-0"
                                                >
                                                    {column.renderHeader ? (
                                                        column.renderHeader({
                                                            column,
                                                            column_index,
                                                        })
                                                    ) : (
                                                        <div className="text-black w-100 p-2">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    {column.name ??
                                                                        "-"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </th>
                                            )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length != 0 ? (
                                    rows.map((row, index) => (
                                        <tr key={index}>
                                            {columns.map(
                                                (column, column_index) =>
                                                    selectedColumns[
                                                        column.key
                                                    ] && (
                                                        <td key={column_index}>
                                                            {column.renderBody
                                                                ? column.renderBody(
                                                                      {
                                                                          column,
                                                                          row,
                                                                          index,
                                                                      }
                                                                  )
                                                                : row[
                                                                      column.key
                                                                  ] ?? "-"}
                                                        </td>
                                                    )
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="text-center"
                                        >
                                            No Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {pagination && pagination.total_page > 0 && (
                    <div className="footer bg-transparent border-dark">
                        <div className="d-flex justify-content-between">
                            <div className="left d-flex align-items-center"></div>
                            <div className="right d-flex align-items-center">
                                <Pagination
                                    loadData={loadData}
                                    pagination={pagination}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    function Range() {
        return (
            <>
                <Calendar
                    placeholder="Date Range"
                    inputStyle={{
                        height: 38,
                    }}
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
            </>
        );
    }

    function Search() {
        const [searchText, setSearchText] = useState("");

        function List({ row, index }) {
            const changeHandler = () => {
                let search = [...searchFields];

                search[index]["value"] = !row.value;
                setSearchFields(search);
            };

            return (
                <li className="form-check ms-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name={row.key}
                        value={row.value}
                        checked={row.value}
                        onChange={() => changeHandler()}
                    />
                    <label
                        className="form-check-label"
                        onClick={() => changeHandler()}
                    >
                        {row.name}
                    </label>
                </li>
            );
        }

        return (
            <>
                <div>
                    <input
                        className="form-control border border-primary"
                        type="text"
                        name="search"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </div>
                <div className="btn-group ms-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                            submitSearchFields(searchText);
                        }}
                    >
                        <div className="d-flex justify-content-center align-items-center">
                            <i className="fas fa-search p-0 m-0"></i>
                            <h5 className="p-0 m-0 ms-2">Search</h5>
                        </div>
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    ></button>
                    <ul className="dropdown-menu">
                        {searchFields.map((row, index) => (
                            <List key={index} row={row} index={index} />
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    function SelectColumns() {
        function List({ column }) {
            const changeHandler = () => {
                setSelectedColumns({
                    ...selectedColumns,
                    [column.key]: !selectedColumns[column.key],
                });
            };
            return (
                <li className="form-check ms-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name={column.key}
                        checked={selectedColumns[column.key]}
                        onChange={() => changeHandler()}
                    />
                    <label
                        className="form-check-label"
                        onClick={() => changeHandler()}
                    >
                        {column.name}
                    </label>
                </li>
            );
        }

        return (
            <div className="border ms-2">
                <button
                    className="btn btn-light btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Select Columns
                </button>
                <ul className="dropdown-menu m-0 p-1">
                    {columns.map(
                        (column, column_index) =>
                            !column.alwaysShow && (
                                <List key={column_index} column={column} />
                            )
                    )}
                </ul>
            </div>
        );
    }

    function PerPage() {
        return (
            <>
                <select
                    name="page"
                    value={pagination.per_page}
                    onChange={(e) => {
                        setPagination({
                            ...pagination,
                            per_page: parseInt(e.target.value),
                        });
                    }}
                    className="form-select form-select-sm"
                    aria-label="Small select example"
                >
                    {perPageNumbers ? (
                        perPageNumbers.map((value, index) => (
                            <option value={value} key={index}>
                                {value}
                            </option>
                        ))
                    ) : (
                        <option value="5">5</option>
                    )}
                </select>
            </>
        );
    }
}

export default DataTable;
