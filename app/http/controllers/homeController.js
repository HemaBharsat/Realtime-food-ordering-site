const Menu = require('../../models/menu');

function homeController() {
    // Factory functions
    return {
        // CRUD
        async index(req, res) {
            const pizzas = await Menu.find()
            console.log(pizzas)
            return res.render('home', { pizzas: pizzas })
        },
    };
}

module.exports = homeController;
