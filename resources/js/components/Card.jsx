function Card({ headerLeft, headerRight, footerLeft, footerRight, children }) {
    return (
        <>
            {
                <div className="card border-dark">
                    {(headerLeft || headerRight) && (
                        <div className="card-header bg-transparent border-dark">
                            <div className="d-flex justify-content-between">
                                <div className="left d-flex align-items-center">
                                    {headerLeft}
                                </div>
                                <div className="right d-flex align-items-center">
                                    {headerRight}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="card-body">{children}</div>
                    {(footerLeft || footerRight) && (
                        <div className="card-footer bg-transparent border-dark">
                            <div className="footer d-flex justify-content-between">
                                <div className="left d-flex align-items-center">
                                    {footerLeft}
                                </div>
                                <div className="right d-flex align-items-center">
                                    {footerRight}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        </>
    );
}

export default Card;
