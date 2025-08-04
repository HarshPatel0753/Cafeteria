function Excel({Export, Import, demo }) {
    return (
        <>
            <div className="btn-group ms-2">
                <button type="button" className="btn btn-outline-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-solid fa-table pe-1"></i>Excel
                </button>
                <ul className="dropdown-menu">
                    <li>
                        {Export && Export}
                    </li>
                    <li>
                        {Import && Import}
                    </li>
                    {demo && <li><a className="dropdown-item" href="/export-demo-excel">Demo</a></li>}
                </ul>
            </div>
        </>
    );
}


export default Excel;
