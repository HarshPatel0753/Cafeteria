import Pagination from "./Pagination";

function DataTable({
    columns,
    rows,
    loadData,
    pagination,
    setPagination,
    perPageNumbers,
}) {
    return (
        <>
            <div className="main">
                {pagination && setPagination && (
                    <div className="header">
                        <div className="d-flex justify-content-between">
                            <div className="left d-flex align-items-center">
                                <PerPage />
                            </div>
                            <div className="right d-flex align-items-center"></div>
                        </div>
                    </div>
                )}
                <div className="body mt-3">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {columns.map((column, index) => (
                                        <th scope="col" key={index}>
                                            {column.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows && rows.length != 0 ? (
                                    rows.map((row, index) => (
                                        <tr key={index}>
                                            {columns.map(
                                                (column, column_index) => (
                                                    <td key={column_index}>
                                                        {column.renderBody
                                                            ? column.renderBody(
                                                                  {
                                                                      column,
                                                                      row,
                                                                      index,
                                                                  }
                                                              )
                                                            : row[column.key] ??
                                                              "-"}
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
                {pagination && setPagination && (
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
