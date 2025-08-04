import GuestLayout from "../components/GuestLayout.jsx";

function Error({ error }) {
    return (
        <>
            <div className="card text-center mt-4">
                <div className="card-body">
                    <h2 className="card-title">
                        This is an {error.responseStatus} Error Page.
                    </h2>
                    <h4 className="card-text mt-2">{error.responseMessage}</h4>
                    <a
                        onClick={() => window.history.back()}
                        className="btn btn-primary mt-2"
                    >
                        Go Back
                    </a>
                </div>
            </div>
        </>
    );
}

Error.layout = (page) => <GuestLayout children={page} />;

export default Error;
