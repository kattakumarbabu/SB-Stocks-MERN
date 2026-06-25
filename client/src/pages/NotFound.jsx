import { Link } from "react-router-dom";

function NotFound() {

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >

            <div className="text-center">

                <h1
                    className="display-1 fw-bold text-primary"
                >
                    404
                </h1>

                <h3 className="mb-3">
                    Page Not Found
                </h3>

                <p className="text-muted mb-4">
                    The page you are looking for doesn't exist.
                </p>

                <Link
                    to="/dashboard"
                    className="btn btn-primary"
                >
                    Go to Dashboard
                </Link>

            </div>

        </div>

    );

}

export default NotFound;