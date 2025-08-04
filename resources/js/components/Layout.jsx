import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

function Layout({ children }) {
    const { url } = usePage();
    const page = usePage().props;
    const { auth, givenPermissions } = page;

    useEffect(() => {
        const sidebarToggle = document.body.querySelector("#sidebarToggle");
        if (sidebarToggle) {
            sidebarToggle.addEventListener("click", (event) => {
                event.preventDefault();
                document.body.classList.toggle("sb-sidenav-toggled");
                localStorage.setItem(
                    "sb|sidebar-toggle",
                    document.body.classList.contains("sb-sidenav-toggled")
                );
            });
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                {givenPermissions.admin_dashboard && (
                    <Link className="navbar-brand ps-3" href="/">
                        Cup Diary
                    </Link>
                )}
                <button
                    className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
                    id="sidebarToggle"
                    href="#!"
                >
                    <i className="fas fa-bars"></i>
                </button>
                <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle d-flex"
                            id="navbarDropdown"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <h5 className="m-0 me-2">{auth.user.username}</h5>
                            <i className="fas fa-user fa-fw"></i>
                        </a>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdown"
                        >
                            {/* <li>
                                <a className="dropdown-item" href="#!">
                                    Settings
                                </a>
                            </li> */}
                            <li>
                                <Link
                                    className={
                                        url.startsWith("/profile")
                                            ? "dropdown-item active"
                                            : "dropdown-item"
                                    }
                                    href="/profile"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item" href="/logout">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav
                        className="sb-sidenav accordion sb-sidenav-dark"
                        id="sidenavAccordion"
                    >
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                {givenPermissions.admin_dashboard && (
                                    <Link
                                        className={
                                            url == "/"
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fas fa-tachometer-alt"></i>
                                        </div>
                                        Dashboard
                                    </Link>
                                )}
                                {givenPermissions.user_view && (
                                    <Link
                                        className={
                                            url.startsWith("/user")
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/user"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                        User
                                    </Link>
                                )}
                                {givenPermissions.vendor_view && (
                                    <Link
                                        className={
                                            url.startsWith("/vendor")
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/vendor"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fa-solid fa-shop"></i>
                                        </div>
                                        Vendor
                                    </Link>
                                )}
                                {givenPermissions.cupList_view && (
                                    <Link
                                        className={
                                            url.startsWith("/cup-list")
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/cup-list"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fa-solid fa-mug-saucer"></i>
                                        </div>
                                        Cup List
                                    </Link>
                                )}
                                {givenPermissions.payment_view && (
                                    <Link
                                        className={
                                            url.startsWith("/payment")
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/payment"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fa-solid fa-credit-card"></i>
                                        </div>
                                        Payment
                                    </Link>
                                )}
                                {givenPermissions.role_view && (
                                    <Link
                                        className={
                                            url.startsWith("/role")
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                        href="/role"
                                    >
                                        <div className="sb-nav-link-icon">
                                            <i className="fa-solid fa-person-circle-check"></i>
                                        </div>
                                        Role
                                    </Link>
                                )}
                                <Link
                                    className={
                                        url.startsWith("/permission")
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    href="/permission"
                                >
                                    <div className="sb-nav-link-icon">
                                        <i className="fa-solid fa-person-circle-check"></i>
                                    </div>
                                    Permission
                                </Link>
                                {/* <Link
                                    className={
                                        url.startsWith("/test-page")
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    href="/test-page"
                                >
                                    <div className="sb-nav-link-icon">
                                        <i className="fa-solid fa-person-circle-check"></i>
                                    </div>
                                    Test Component
                                </Link> */}
                            </div>
                        </div>
                    </nav>
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="p-3">{children}</div>
                        </div>
                    </main>

                    <footer className="py-4 bg-light mt-auto">
                        <div className="container-fluid px-4">
                            <div className="d-flex align-items-center justify-content-between small">
                                <div className="text-muted">
                                    Copyright &copy; Your Website 2024
                                </div>
                                <div>
                                    <a href="#">Privacy Policy</a>
                                    &middot;
                                    <a href="#">Terms &amp; Conditions</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default Layout;
