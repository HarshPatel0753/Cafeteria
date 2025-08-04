import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "../../components/Modal.jsx";

const DeliveryPersonsList = forwardRef(function DeliveryPersonsList(
    props,
    ref
) {
    let modalRef = useRef(null);
    const [titleText, setTitleText] = useState("");
    const [fields, setFields] = useState([]);

    function openModal(name, rows) {
        setTitleText(name);
        setFields(rows);
        modalRef.current.show();
    }

    function closeModal() {
        setTitleText("");
        setFields([]);
    }

    useImperativeHandle(ref, () => {
        return {
            openModal,
            closeModal,
        };
    });

    return (
        <Modal
            id="deliveryPersonsView"
            title={titleText}
            modalSize="modal-lg"
            ref={modalRef}
            closeModal={closeModal}
            closeModalButton={() => {
                return false;
            }}
        >
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Mobile Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{field.name}</td>
                                <td>{field.mobile_number || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
});

export default DeliveryPersonsList;
