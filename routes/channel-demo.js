const express = require('express')
const router = express.Router()
router.use(express.json())
const conn = require('../db')


router.route('/channels')
    .post(function (req, res) {
        let { name, desc, user_id } = req.body

        conn.query(`SELECT * FROM channels WHERE name = ?`, name, function (err, results) {
            if (results.length) {
                res.status(409).json({
                    message: 'Channel already exists'
                })
            } else {
                


                conn.query(`INSERT INTO channels (name, desc, user_id) VALUES (?, ?, ?)`, [name, desc, user_id],
                    function (err, results, fields) {
                        res.status(201).json({
                            message: `Channel ${name} created`
                        })
                    }
                )
            }
        })




    }) //channel create
    .get(function (req, res) {

        var { user_id } = req.body

        if (user_id) {
            conn.query(`SELECT * FROM channels WHERE user_id = ?`, user_id,
                function (err, results) {
                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundchannel(res)
                    }
                }
            )
        } else {
            res.status(400).json({
                message: 'Bad request'
            }).end()
        }
        

        

    }) //channel list

router.route('/channel/:id')
    .delete(function (req, res) {
        let {channel_id }= req.params

        conn.query(`SELECT * FROM channels WHERE id = ?`, channel_id, 
            function (err, results) {
                if (results.length) {
                    conn.query(`DELETE FROM channels WHERE id = ?`, id,
                        function (err, results) {
                            res.status(200).json({
                                message: 'Channel deleted'
                            })
                        }
                    )
                } else {
                    notFoundchannel(res)
                }
            }
        )
    }) //single channel delete 
    .get(function (req, res) {
        let { id } = req.params
        id = parseInt(id)

        conn.query(`SELECT * FROM channels WHERE id = ?`, id,
            function (err, results) {

                if (results.length) {
                    res.status(200).json(results)
                } else {
                    notFoundchannel(res)
                }
            }
        )

    }) //channle detail
    .put(function (req, res) {
        let { id } = req.params
        id = parseInt(id)

        var channel = db.get(id)
        console.log("channel name", channel)

        var oldName = channel.name

        if (channel) {
            var newName = req.body.name
            channel.name = newName

            db.set(id, channel)
            res.status(200).json({
                message: `Channel ${oldName} modified to ${newName}`
            })
        } else {
            res.status(400).json({
                message: 'Bad request'
            })
        }
    }) //channel modify

function notFoundchannel(res) {
    res.status(404).json({
        message: 'Channel not found'
    })
}

module.exports = router

