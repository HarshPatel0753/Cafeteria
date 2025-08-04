import "bootstrap-icons/font/bootstrap-icons.css";
import { usePage } from "@inertiajs/react";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { useEffect, useRef, useState } from "react";
import Form from "./Form";

function Index() {
    const page = usePage().props;
    const { id } = page.auth.user;
    const [user, setUser] = useState({});
    let formRef = useRef(null);

    useEffect(() => {
        loadUser();
    }, []);

    const openUserForm = () => {
        formRef.current.openModal(user);
    };

    const loadUser = async () => {
        AxiosInstance({
            method: "get",
            url: `profile/get-user/${id}`,
        })
            .then((response) => {
                setUser(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <>
            <div>
                <div className="card col-6">
                    <div className="card-header">
                        <div className="left d-flex align-items-center">
                            <h3 className="m-0 p-0">User Profile</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="profileImage row">
                            <div
                                className="col-6 d-flex align-items-center justify-content-center border border-dark"
                                height={120}
                                style={{
                                    width: 120,
                                    borderRadius: 100,
                                }}
                            >
                                <img
                                    src={user.profile_image_path}
                                    height={115}
                                    style={{
                                        width: 115,
                                        borderRadius: 100,
                                    }}
                                />
                            </div>
                            <div className="col-6">
                                <div className="mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h4 className="m-0 p-0">Username :</h4>
                                        <h4 className="m-0 p-0 ms-3 mt-1">
                                            {user.username}
                                        </h4>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h4 className="m-0 p-0">Role :</h4>
                                        <h4 className="m-0 p-0 ms-3 mt-1">
                                            {user.role_name}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border mt-3 mb-3" />
                        <div className="d-flex align-items-center justify-content-between ps-2 pe-2">
                            <h2 className="m-0 p-0">User Details</h2>
                            <label onClick={() => openUserForm()}>
                                <i className="fas fa-edit fa-xl"></i>
                            </label>
                        </div>
                        <div className="border mt-3 mb-3" />
                        <div className="details">
                            <div className="row g-2">
                                <div className="col-6 mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h5 className="m-0 p-0">
                                            First Name :
                                        </h5>
                                        <h5 className="m-0 p-0 ms-3">
                                            {user.first_name}
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h5 className="m-0 p-0">Last Name :</h5>
                                        <h5 className="m-0 p-0 ms-3">
                                            {user.last_name}
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h5 className="m-0 p-0">
                                            Mobile Number :
                                        </h5>
                                        <h5 className="m-0 p-0 ms-3">
                                            {user.mobile_number}
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="me-2 p-2 d-flex align-items-center">
                                        <h5 className="m-0 p-0">Email :</h5>
                                        <h5 className="m-0 p-0 ms-3">
                                            {user.email}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Form ref={formRef} loadUser={loadUser}></Form>
        </>
    );
}

export default Index;
