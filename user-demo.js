const express = require('express');
const app = express()
app.listen(7777)

let db = new Map()
var id = 1

app.use(express.json())

app.post('/login', function (req, res) {
    let { username, password } = req.body

    if (db.has(username)) {
        if (db.get(username) === password) {
            res.json({
                message: 'Login success'
            })
        } else {
            res.json({
                message: 'Login failed'
            })
        }
    } else {
        res.json({
            message: 'Login failed'
        })
    }
})

app.post('/join', function (req, res) {
    let { username, password } = req.body

    console.log(req.body.username)

    if (req.body.username === undefined) {
        res.status(400).json('Bad request')
    } else {
        db.set(id++, req.body)
        res.status(201).json({
            message: `User ${username} created`
        })
    }


})

//조회
app.route('/user/:id') 
.get(function (req, res) {
    
    let { id } = req.params
    id = parseInt(id)

    const user = db.get(id)

    if (db.has(id)) {
        res.json(user)
    } else {
        res.status(404).json({
            message : 'User not found'
        })
    }
})
.delete(function (req, res) {
    
    let { id } = req.params
    id = parseInt(id)

    if (db.has(id)) {
        let username = db.get(id).username
        db.delete(id)
        res.send(`User ${username} deleted`)
    } else {
        res.status(404).send('User not found')
    }
})
