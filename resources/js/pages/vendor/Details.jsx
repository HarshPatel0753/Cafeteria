import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "../../components/Modal";

const Details = forwardRef(function Details(props, ref) {
    const [titleText, setTitleText] = useState("");
    const [fields, setFields] = useState([]);
    const [delivery_persons, setDeliveryPersons] = useState([]);
    const [products, setProducts] = useState([]);
    let modalRef = useRef(null);

    const openModal = (name, rows) => {
        setTitleText(name);
        setFields(rows);
        setDeliveryPersons(rows.delivery_persons);
        setProducts(rows.products);
        modalRef.current.show();
    }

    const closeModal = () => {
        setTitleText("");
        setFields([]);
        setDeliveryPersons([]);
        setProducts([]);
        modalRef.current.close();
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    return (
        <Modal
            id={'vendorsDetailView'}
            title={titleText}
            modalSize="modal-lg"
            ref={modalRef}
            closeModal={() => { closeModal }}
            closeModalButton={() => {
                return false;
            }}
        >
            <div className="card mb-2">
                <div className="card-body row">
                    <div className="col-6 row mb-4">
                        <div className="col-6">
                            <b>Mobile Number :</b>
                        </div>
                        <div className="col-6">{fields.mobile_number}</div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-6">
                            <b>Email :</b>
                        </div>
                        <div className="col-6">{fields.email}</div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-6">
                            <b>Address : </b>
                        </div>
                        <div className="col-6">{fields.address}</div>
                    </div>
                    <div className="col-6 row mb-2">
                        <div className="col-6">
                            <b>GST Number : </b>
                        </div>
                        <div className="col-6">
                            {fields.gst_number || '-'}
                        </div>
                    </div>
                </div>
            </div>
            <h4>Delivery Persons :</h4>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Name</th>
                            <th>Mobile Number</th>
                        </tr>
                        {delivery_persons.map((delivery_person, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{delivery_person.name}</td>
                                <td>{delivery_person.mobile_number || "-"}</td>
                            </tr>
                        ))}
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
            <h4>Products :</h4>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{product.name}</td>
                                <td>{product.price || "-"}</td>
                            </tr>
                        ))}
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </Modal>
    );
});

export default Details;
