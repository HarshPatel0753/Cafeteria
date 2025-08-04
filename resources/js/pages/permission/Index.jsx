import { Link, router } from "@inertiajs/react";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import AxiosInstance from "../../components/AxiosInstance";

function Index() {
    const [isEditable, setIsEditable] = useState(false);
    const [permissions, setPermission] = useState([]);
    const [roles, setRoles] = useState([]);

    function loadData() {
        AxiosInstance({
            method: "post",
            url: `/permission/load-data`,
        })
            .then((response) => {
                setPermission(response.data.permissions);
                setRoles(response.data.all_roles);
            })
            .catch(function (error) {
                console.log(error.response);
            });
        // axios
        //     .post(
        //         `http://127.0.0.1:8000/permission/load-data`
        //     )
        //     .then(function (response) {
        //         setPermission(response.data.permissions);
        //         setRoles(response.data.all_roles);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdate = () => {
        setIsEditable(true);
    };

    const handleSubmit = () => {
        let role_permission = {};
        permissions.map((value, index1) => {
            value.permissions.map((permission, index) => {
                permission.roles.map((role, key) => {
                    const { id, has_permission } = role;
                    if (has_permission) {
                        if (!role_permission[id]) {
                            role_permission[id] = [];
                        }
                        role_permission[id].push(permission.id);
                    } else {
                        if (!role_permission[id]) {
                            role_permission[id] = [];
                        }
                    }
                });
            });
        });

        AxiosInstance({
            method: "post",
            url: "/permission/store-or-update",
            data: role_permission,
        })
            .then((response) => {
                router.visit("/permission");
            })
            .catch(function (error) {
                console.log(error.response);
            });

        // axios
        //     .post("http://127.0.0.1:8000/permission/store-or-update", role_permission)
        //     .then(function (response) {
        //         router.visit("/permission");
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        setIsEditable(false);
    };
    const handleCancel = () => {
        router.visit("/permission");
        setIsEditable(false);
    };

    function handleChanges(mainIndex, permissionIndex, roleIndex) {
        let data = [...permissions];
        data[mainIndex].permissions[permissionIndex].roles[
            roleIndex
        ].has_permission =
            !data[mainIndex].permissions[permissionIndex].roles[roleIndex]
                .has_permission;

        setPermission(data);
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <Link className="breadcrumb-item" href="/">
                        Home
                    </Link>
                    <li className="breadcrumb-item active" aria-current="page">
                        Permission
                    </li>
                </ol>
            </nav>
            <Card
                headerLeft={<b>Permissions</b>}
                headerRight={
                    isEditable === false && (
                        <button
                            className="btn btn-outline-dark"
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    )
                }
                footerRight={
                    isEditable === true && (
                        <>
                            <button
                                className="btn btn-secondary ms-2"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary ms-2"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </>
                    )
                }
            >
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            {roles &&
                                roles.map((role, index) => (
                                    <th scope="col" key={index}>
                                        {role.name}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions &&
                            permissions.map((value, mainIndex) => (
                                <Permissions
                                    key={mainIndex}
                                    permissions={permissions}
                                    value={value}
                                    mainIndex={mainIndex}
                                    isEditable={isEditable}
                                    handleChanges={handleChanges}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>
        </>
    );
}

function Permissions({
    permissions,
    value,
    mainIndex,
    isEditable,
    handleChanges,
}) {
    return (
        <>
            <tr key={mainIndex}>
                <td colSpan={2 + permissions.length}>
                    <b>{value.category}</b>
                </td>
            </tr>
            {value.permissions.map((permission, permissionIndex) => (
                <tr key={permissionIndex}>
                    <td>{permission.id}</td>
                    <td>{permission.name}</td>
                    {permission.roles.map((role, roleIndex) => (
                        <td key={roleIndex}>
                            {isEditable == false ? (
                                role["has_permission"] ? (
                                    " ✔ "
                                ) : (
                                    "✗"
                                )
                            ) : (
                                <input
                                    type="checkbox"
                                    name="permission"
                                    id="permission"
                                    checked={role["has_permission"] ?? 0}
                                    onChange={() => {
                                        handleChanges(
                                            mainIndex,
                                            permissionIndex,
                                            roleIndex
                                        );
                                    }}
                                />
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default Index;
