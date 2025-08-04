const ProductCard = ({ index, cupList, changeCupListField }) => {
    let total = cupList.cups > 0 ? cupList.cups * cupList.price : 0;
    return (
        <>
            <div className="card col-5">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex">
                            <h5>{cupList.name}</h5>
                        </div>
                        <div className="d-flex">
                            <h5 className="text-">₹{cupList.price}</h5>
                        </div>
                    </div>
                    <div className="d-flex d-row align-items-center justify-content-between">
                        <div className="d-flex pt-2 w-50 me-4">
                            <button
                                type="button"
                                className="btn btn-outline-primary me-1"
                                onClick={() => {
                                    changeCupListField(index, cupList.cups - 1);
                                }}
                            >
                                <i className="fas fa-minus"></i>
                            </button>

                            <input
                                id={`cupField${index}`}
                                min="0"
                                name=""
                                value={cupList.cups}
                                type="number"
                                className="form-control form-control-sm"
                                onChange={(e) => {
                                    changeCupListField(index, e.target.value);
                                }}
                            />

                            <button
                                type="button"
                                className="btn btn-outline-primary ms-1"
                                onClick={() => {
                                    changeCupListField(index, cupList.cups + 1);
                                }}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <h5 className="mt-1">total :</h5>
                            <h4 className="btn btn-success ms-2 mt-1">
                                {total}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
