function errorHandler (error, req, res, next) {
    error.status = error.status || 500;

    res.status(error.status).json({
        error: {
            status: error.status,
            message: error.message || 'Internal Server Error',
            stack: error.stack || ''
        }
    });
}

module.exports = errorHandler;
