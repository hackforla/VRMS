module.exports = function (app) {
	
    app.get('/users/:id', (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint to get a user.'
            
        const filter = req.query.filter;

        return res.status(404).send(false)

    })
}