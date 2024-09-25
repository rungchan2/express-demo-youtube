const express = require('express')
const router = express.Router()
router.use(express.json())
const conn = require('../db')
const { param, body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Bad request', errors: errors.array() });
    }
    next();
}

router.route('/channels')
    .post(
        [
            body('user_id').notEmpty().isInt().withMessage('user_id must be integer'),
            body('name').notEmpty().isString().withMessage('name must be string'),
            validate
        ],
        function (req, res) {

            let { name, user_id } = req.body

            conn.query(`INSERT INTO channels (name, user_id) VALUES (?, ?)`, [name, user_id],
                function (err, results) {
                    if (err) {
                        res.status(400).json({
                            message: 'Bad request'
                        })
                    }
                    res.status(201).json({
                        message: `Channel ${name} created`,
                        info: results
                    })
                }
            )
        }) //channel create
    .get(
        [
            body('user_id').notEmpty().isInt().withMessage('user_id must be integer'),
            validate
        ], function (req, res) {

            var { user_id } = req.body

            conn.query(`SELECT * FROM channels WHERE user_id = ?`, user_id,
                function (err, results) {
                    if (err) {
                        res.status(400).json({
                            message: 'Bad request'
                        })
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        notFoundchannel(res)
                    }
                }
            )

        }) //channel list

router.route('/channel/:id')
    .delete(
        [
            param('id').notEmpty().isInt().withMessage('channel id required in number form'),
            validate
        ], (req, res) => {

            let { id } = req.params
            console.log(id)

            conn.query(`SELECT * FROM channels WHERE id = ?`, id,
                function (err, results) {
                    if (results.length) {
                        conn.query(`DELETE FROM channels WHERE id = ?`, id,
                            function (err, results) {
                                res.status(200).json({
                                    message: 'Channel deleted',
                                    info: results
                                })
                            }
                        )
                    } else {
                        notFoundchannel(res)
                    }
                }
            )
        }) //single channel delete 
    .get(
        [
            param('id').notEmpty().isInt().withMessage('channel id required in number form'),
            validate
        ], (req, res) => {

            let { id } = req.params

            conn.query(`SELECT * FROM channels WHERE id = ?`, id,
                function (err, results) {

                    if (err) {
                        return res.status(400).json({
                            message: 'Bad request no channel found'
                        })
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        return notFoundchannel(res)
                    }
                }
            )

        }) //channle detail
    .put(
        [
            param('id').notEmpty().isInt().withMessage('channel id required in number form'),
            validate
        ], (req, res) => {



            let { id } = req.params

            conn.query(`SELECT * FROM channels WHERE id = ?`, id,
                function (err, results) {
                    if (results.length) {
                        let { name } = req.body
                        conn.query(`UPDATE channels SET name = ? WHERE id = ?`, [name, id],
                            function (err, results) {
                                res.status(200).json({
                                    message: 'Channel modified',
                                    info: results
                                })
                            }
                        )
                    } else {
                        notFoundchannel(res)
                    }
                }
            )

        }) //channel modify

function notFoundchannel(res) {
    res.status(404).json({
        message: 'Channel not found'
    })
}


module.exports = router

