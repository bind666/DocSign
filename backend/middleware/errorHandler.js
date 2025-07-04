const errorHandler = (err, req, res, next) => {
    const message = err.message || "Something went wrong";
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
