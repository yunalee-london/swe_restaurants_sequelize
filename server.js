const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {Restaurant, sequelize, Menu, Item} = require('./models')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

//const path = require('path')

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// })

app.use(express.static("public"))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    const date= new Date()
    res.render('date', {date})
})

app.get('/restaurants', async(req, res) => {
    const restaurants = await Restaurant.findAll({
        include : [
            {model: Menu , as: 'menus'}
        ]
    })
    res.render('restaurants', {restaurants})
})

app.get('/restaurants/:id', async(req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menus = await restaurant.getMenus({
        include : ['items']
    })
    res.render('restaurant', {restaurant, menus})
})

//add
app.post('/restaurants', async(req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/restaurants')
})
app.post('/restaurants/:id', async(req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.createMenu(req.body)
    res.redirect(`/restaurants/${restaurant.id}`)
})

app.post('/restaurants/:restaurant_id/menus/:menu_id', async(req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    await menu.createItem(req.body)
    res.redirect(`/restaurants/${req.params.restaurant_id}`)
})

// app.get('restaurants/:id/delete', async (req, res) => {
//     console.log("----------Delete----------", req.params.id)
//     const restaurant = await Restaurant.findByPk(req.params.id)
//     await restaurant.destroy()
//     res.redirect('/restaurants')
// })

//restaurant delete edit
app.get('/restaurants/:id/delete', (req, res) => {
    Restaurant.findByPk(req.params.id)
        .then(restaurant => {
            restaurant.destroy()
            res.redirect('/restaurants')
        })
})
app.get('/restaurants/:id/edit', async(req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('edit', {restaurant})
})

app.post('/restaurants/:id/edit', async(req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.update(req.body)
    res.redirect(`/restaurants/${restaurant.id}`)
})

//menu delete edit
app.get('/restaurants/:restaurant_id/menus/:menu_id/delete', async(req, res) =>{
    const restaurant = await Restaurant.findByPk(req.params.restaurant_id)
    const menu = await Menu.findByPk(req.params.menu_id)
    await menu.destroy()
    res.redirect(`/restaurants/${restaurant.id}`)
})

app.get('/restaurants/:restaurant_id/menus/:menu_id/editmenu', async(req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    const restaurant_id = req.params.restaurant_id
    res.render('editmenu', {restaurant_id, menu})
})

app.post('/restaurants/:restaurant_id/menus/:menu_id/editmenu', async(req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    await menu.update(req.body)
    res.redirect(`/restaurants/${req.params.restaurant_id}`)
})

// item delete edit
app.get('/restaurants/:restaurant_id/menus/:menu_id/items/:item_id/delete', async(req, res) =>{
    const item = await Item.findByPk(req.params.item_id)
    await item.destroy()
    res.redirect(`/restaurants/${req.params.restaurant_id}`)
})

app.get('/restaurants/:restaurant_id/menus/:menu_id/items/:item_id/edititem', async(req, res) => {
    const item = await Item.findByPk(req.params.item_id)
    const restaurant_id = req.params.restaurant_id
    const menu_id = req.params.menu_id
    res.render('edititem', {restaurant_id, menu_id, item})
})

app.post('/restaurants/:restaurant_id/menus/:menu_id/items/:item_id/edititem', async(req, res) => {
    const item = await Item.findByPk(req.params.item_id)
    await item.update(req.body)
    res.redirect(`/restaurants/${req.params.restaurant_id}`)
})

app.listen(3000, async() => {
    await sequelize.sync()
    console.log("Web server is running")
})