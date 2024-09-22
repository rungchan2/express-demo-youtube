const express = require('express');
const router = express.Router();
router.use(express.json())
const conn = require('../db')


router.post('/login', function (req, res) {

    const { email, password } = req.body

    conn.query(`SELECT * FROM users WHERE email = ?`, [email],
        function (err, results) {

            loginUser = results[0]

            if (loginUser && loginUser.password === password) {
                res.status(200).json({
                    message: 'Login success'
                })
            } else if (loginUser && loginUser.password !== password) {
                res.status(400).json({
                    message: 'Password is incorrect'
                })
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        }
    )

    
}
)

router.post('/join', function (req, res) {
    let { email, password, name, contact } = req.body

    conn.query(
        `SELECT * FROM users WHERE email = ?`, email,
        function (err, results) {
            if (results.length > 0) {
                res.status(409).json({
                    message: 'User already exists'
                })
            } else {
                conn.query(`INSERT INTO users (email, password, name, contact) VALUES (?, ?, ?, ?)`,
                    [email, password, name, contact],
                    function (err, results, fields) {
                        res.status(201).json({
                            message: 'Join success'
                        })
                    })
            }
        }
    );


})

//조회
router.route('/user')
    .get(function (req, res) {

        let { email, name } = req.body
        console.log(email)
        console.log(name)

        conn.query(
            `SELECT * FROM users WHERE email = ?`, email,
            function (err, results) {
                if (results) {
                    console.log(results)
                    res.json(results)
                } else {
                    console.log('error')
                }
            }
        );


    })
    .delete(function (req, res) {

        let { email } = req.body

        conn.query(`DELETE FROM users Where email = ?`, email,
            function( err, results) {
                if (results.affectedRows > 0) {
                    res.status(200).json({
                        message: `User ${email} deleted`
                    })
                } else {
                    res.status(404).json(`User ${email} not found`)
                }
            }
        )
    })

module.exports = router;
