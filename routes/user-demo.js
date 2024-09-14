const express = require('express');
const router = express.Router();
router.use(express.json())

let db = new Map()
var id = 1


router.post('/login', function (req, res) {

    const { username, password } = req.body

    var loginUser = {}


    db.forEach((user, id) => {
        if (user.username === username) {
            loginUser = user
        }
    })


    function isExsist(obj) {
        return Object.keys(obj).length !== 0
    }

    if (isExsist(loginUser)) {
        if (loginUser.password === password) {
            res.json({
                message: 'Login success'
            })
        } else {
            res.status(401).json({
                message: 'password is wrong'
            })
        }
    } else {
        res.status(404).json({
            message: 'User not found'
        })
    }
}
)

router.post('/join', function (req, res) {
    let { username, password } = req.body

    if (req.body.username === undefined) {
        res.status(400).json('Bad request')
    } else {
        db.set(username, req.body)
        res.status(201).json({
            message: `User ${username} created`
        })
    }


})

//조회
router.route('/user')
    .get(function (req, res) {

        let { username } = req.body

        const user = db.get(username)

        if (db.has(username)) {
            res.json(user)
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    })
    .delete(function (req, res) {

        let { username } = req.body

        if (db.has(username)) {
            const pusername = db.get(username).username
            db.delete(id)
            res.json({message: `User ${pusername} deleted`})
        } else {
            res.status(404).send('User not found')
        }
    })

module.exports = router;
