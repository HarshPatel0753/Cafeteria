import { useForm, router } from "@inertiajs/react";
import GuestLayout from "../components/GuestLayout.jsx";
import { usePage } from "@inertiajs/react";
import AxiosInstance from "../components/AxiosInstance.jsx";

function Login() {
    const baseUrl = usePage().props.url;
    // console.log(baseUrl);
    const {
        data: fields,
        setData: setFields,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm({ email: "", password: "" });

    function submit(e) {
        e.preventDefault();
        clearErrors();

        AxiosInstance({
            method: "post",
            url: "login-post",
            data: fields,
        })
            .then((response) => {
                if (response.data.isValid == true) {
                    router.visit("/");
                } else {
                    setError({ email: [response.data.email] });
                }
            })
            .catch(function (error) {
                console.log(error.response.data.errors);
                setError(error.response.data.errors);
            });
        // axios
        //     .post(`${AxiosInstance}/login-post`, fields)
        //     .then(function (response) {
        //         if (response.data.isValid == true) {
        //             router.visit("/");
        //         } else {
        //             setError({ email: [response.data.email] });
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error.response.data.errors);
        //         setError(error.response.data.errors);
        //     });
    }

    return (
        <>
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header">
                                        <h3 className="text-center font-weight-light my-4">
                                            Login
                                        </h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={submit}>
                                            <div className="form-floating mb-3">
                                                <input
                                                    id="inputEmail"
                                                    type="email"
                                                    name="email"
                                                    value={fields.email}
                                                    onChange={(e) => {
                                                        setFields(
                                                            "email",
                                                            e.target.value
                                                        );
                                                    }}
                                                    className={`form-control ${
                                                        errors.email
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    placeholder="name@example.com"
                                                />
                                                <label htmlFor="inputEmail">
                                                    Email address
                                                </label>
                                                <div className="invalid-feedback">
                                                    {errors.email}
                                                </div>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    id="inputPassword"
                                                    type="password"
                                                    name="password"
                                                    value={fields.password}
                                                    onChange={(e) => {
                                                        setFields(
                                                            "password",
                                                            e.target.value
                                                        );
                                                    }}
                                                    className={`form-control ${
                                                        errors.password
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    placeholder="Password"
                                                />
                                                <label htmlFor="inputPassword">
                                                    Password
                                                </label>
                                                <div className="invalid-feedback">
                                                    {errors.password}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mt-4 mb-0">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

Login.layout = (page) => <GuestLayout children={page} />;

export default Login;
