import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "../../components/Modal.jsx";

const Details = forwardRef(function Details(props, ref) {
    let modalRef = useRef(null);
    const [titleText, setTitleText] = useState("");
    const [fields, setFields] = useState({});
    const [cupList, setCupList] = useState([]);

    function openModal(name, rows) {
        setTitleText(name);
        setFields(rows);
        setCupList(rows.cup_list);
        modalRef.current.show();
    }

    function closeModal() {
        setTitleText("");
        setFields([]);
        setCupList([]);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    return (
        <Modal
            id="cupListDetailsView"
            title={titleText}
            modalSize="modal-lg"
            ref={modalRef}
            closeModal={closeModal}
            closeModalButton={() => {
                return false;
            }}
        >
            <div className="card mb-2">
                <div className="card-body row">
                    <div className="col-6 row mb-2">
                        <div className="col-4">
                            <b>ID : </b>
                        </div>
                        <div className="col-8">{fields.id}</div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-4">
                            <b>Vendor : </b>
                        </div>
                        <div className="col-8">
                            {fields.vendors && fields.vendors.name}
                        </div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-4">
                            <b>Entry At : </b>
                        </div>
                        <div className="col-8">{fields.entry_at}</div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-4">
                            <b>Remark : </b>
                        </div>
                        <div className="col-8">{fields.remark || "-"}</div>
                    </div>
                    <div className="col-6 row">
                        <div className="col-4">
                            <b>Created By :</b>
                        </div>
                        <div className="col-8">
                            {fields.users && fields.users.username}
                        </div>
                    </div>
                </div>
            </div>
            <h4>Cup List :</h4>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Product</th>
                            <th scope="col">Cups</th>
                            <th scope="col">Price</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cupList.map((cup, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{cup.products.name}</td>
                                <td>{cup.cups}</td>
                                <td>{cup.price}</td>
                                <td>{cup.cups * cup.price}</td>
                            </tr>
                        ))}
                        <tr>
                            <th>Total</th>
                            <td>-</td>
                            <th>{fields.total_cups}</th>
                            <td>-</td>
                            <th>{fields.total_amount}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>
    );
});

export default Details;
