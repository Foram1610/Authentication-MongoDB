const express  = require('express')
const route = express.Router()
const user = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth')
const imageMiddleware = require('../middlewares/avatar')

route.post('/',authMiddleware,imageMiddleware.single('avatar'),user.addUser)
route.put('/:_id',authMiddleware,imageMiddleware.single('avatar'),user.updateUser)
route.delete('/:_id',authMiddleware,user.deleteUser)
route.post('/getAll',authMiddleware,user.getAllUsers)

module.exports = route