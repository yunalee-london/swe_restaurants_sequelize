const {Restaurant, sequelize, Menu, Item} = require('./models')

beforeAll(async() => {
    await sequelize.sync()
})
describe('Restaurant', () => {
    test("when restaurant is created it is added to the database", async() => {
        const restaurant = await Restaurant.create({name: "Coco", image: "imageURL"})
        expect(restaurant.id).toBeTruthy()
    })
    test('can add a menu to a restaurant', async() => {
        const restaurant = await Restaurant.create({name: "Chia", image: "imageURL"})
        const menu = await Menu.create({title: "Dessert"})
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        expect(menus.length).toBe(1)
    })
    test('can add an item to a menu', async() => {
        const menu = await Menu.create({title: "Dessert"})
        const item = await Item.create({title: "Brownie", price: 3.50})
        await menu.addItem(item)
        const items = await menu.getItems()
        expect(items.length).toBe(1)

    })
})