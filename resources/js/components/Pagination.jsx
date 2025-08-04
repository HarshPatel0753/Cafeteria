import { useEffect, useRef, useState } from "react";

function Pagination({ loadData, pagination }) {
    const [paginationButton, setPaginationButton] = useState([]);
    let totalPage = pagination.total_page;
    let currentPage = pagination.current_page;

    useEffect(() => {
        if (pagination.current_page > pagination.total_page) {
            loadData(pagination.total_page);
        }
        createPaginationButtons();
    }, [pagination]);

    let firstButton = (
        <li className="page-item" key="first">
            <button
                className="btn page-link"
                aria-label="Previous"
                onClick={() => {
                    currentPage != 1 && loadData(currentPage - 1);
                }}
                disabled={totalPage < 2 ? true : false}
            >
                <span aria-hidden="true">&laquo;</span>
            </button>
        </li>
    );

    let lastButton = (
        <li className="page-item" key="last">
            <button
                className="btn page-link"
                aria-label="Next"
                onClick={() => {
                    currentPage != totalPage && loadData(currentPage + 1);
                }}
                disabled={totalPage < 2 ? true : false}
            >
                <span aria-hidden="true">&raquo;</span>
            </button>
        </li>
    );

    const listButton = (row, index) => {
        return (
            <li className="page-item" key={index}>
                <a
                    className={
                        currentPage == row && row != "..."
                            ? "btn page-link active"
                            : "btn page-link"
                    }
                    onClick={() =>
                        currentPage != row && row != "..." && loadData(row)
                    }
                >
                    {row}
                </a>
            </li>
        );
    };

    const createPaginationButtons = () => {
        let lists = [];
        if (totalPage > 7) {
            if (currentPage < 5) {
                lists.push(1, 2, 3, 4, 5, "...", totalPage);
            }

            if (currentPage > totalPage - 4) {
                lists.push(
                    1,
                    "...",
                    totalPage - 4,
                    totalPage - 3,
                    totalPage - 2,
                    totalPage - 1,
                    totalPage
                );
            }

            if (currentPage >= 5 && currentPage <= totalPage - 4) {
                lists.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPage
                );
            }
        } else {
            for (let index = 1; index <= totalPage; index++) {
                lists.push(listButton(index, index));
            }
        }
        setPaginationButton(lists);
    };

    return (
        <>
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {firstButton}
                    {paginationButton.length >= 7
                        ? paginationButton.map((row, index) =>
                              listButton(row, index)
                          )
                        : paginationButton}
                    {lastButton}
                </ul>
            </nav>
        </>
    );
}

export default Pagination;
