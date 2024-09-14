const express = require('express')
const router = express.Router()
router.use(express.json())

let db = new Map()
var id = 1

router.route('/channels')
    .post(function (req, res) {
        let { name, description } = req.body
        let channel = req.body

        if (req.body.name === undefined) {
            res.status(400).json({
                message: 'Bad request'
            })
        } else {
            db.set(id++, channel)
            res.status(201).json({
                message: `Channel ${name} created`
            })
        }
    }) //channel create
    .get(function (req, res) {
        let channelList = []
        var { username } = req.body


        db.forEach((channel, id) => {
            if (channel.username === username && channel.username !== undefined) {
                channelList.push({
                    id: id,
                    name: channel.name,
                    description: channel.description,
                    username: channel.username
                })
            }
        })

        if (channelList.length === 0) {
            notFoundchannel()
        } else {
            res.status(200).json(channelList)
        }
    }) //channel list

router.route('/channel/:id')
    .delete(function (req, res) {
        let id = req.params.id
        id = parseInt(id)

        var channel = db.get(id)

        if (channel) {
            db.delete(id)

            res.status(200).json({
                message: `Channel ${channel.name} deleted`
            })
        } else {
            notFoundchannel()
        }
    }) //single channel delete 
    .get(function (req, res) {
        let id = req.params.id
        id = parseInt(id)

        var channel = db.get(id)

        if (channel) {
            res.json(channel)
        } else {
            notFoundchannel()
        }
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

function notFoundchannel() {
    res.status(404).json({
        message: 'Channel not found'
    })
}

module.exports = router

