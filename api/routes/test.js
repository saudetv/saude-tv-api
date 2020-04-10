
module.exports = app => {
    app.route('/api/v1/customer-wallets').get((req, res) => {
        res.status(200).json('apa');
    })
}