const express = require('express');
const router = express.Router();
router.use(express.json())
const conn = require('../db')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()
var cookieParser = require('cookie-parser')
router.use(cookieParser())





const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Bad request', errors: errors.array() });
    }
    next();
}
const createEmailChain = () => body('email').notEmpty().isEmail().withMessage('email must be email')
const createPasswordChain = () => body('password').notEmpty().isString().withMessage('password must be string')
const createNameChain = () => body('name').notEmpty().isString().withMessage('name must be string')
const createContactChain = () => body('contact').notEmpty().isString().withMessage('contact must be string')


router.post('/login',
    [
        createEmailChain(),
        createPasswordChain(),
        validate
    ], (req, res) => {

        const { email, password } = req.body

        conn.query(`SELECT * FROM users WHERE email = ?`, [email],
            function (err, results) {

                loginUser = results[0]

                if (loginUser && loginUser.password === password) {

                    const token = jwt.sign({ 
                        email: loginUser.email,
                        name: loginUser.name,
                        tokexpiresIn: '30m', 
                        issuer: 'heechan'
                    
                    }, process.env.JWT_SECRET, { expiresIn: '1h' })

                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'none'
                    })

                    res.status(200).json({
                        message: 'Login success',
                        token
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

router.post('/join',
    [
        createEmailChain(),
        createPasswordChain(),
        createNameChain(),
        createContactChain(),
        validate
    ]
    , (req, res) => {

        let { email, password, name, contact } = req.body
        console.log(email, password, name, contact)

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
                        function (err, results) {
                            if (err) {
                                return res.status(400).json({
                                    message: 'Bad request'
                                })
                            }
                            res.status(201).json({
                                message: 'Join success',
                                info: results
                            })
                        })
                }
            }
        );


    })

//조회
router.route('/user')
    .get(
        [
            createEmailChain(),
            validate
        ], (req, res) => {

            let { email } = req.body

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
    .delete(
        [
            createEmailChain(),
            validate
        ], (req, res) => {

            let { email } = req.body

            conn.query(`DELETE FROM users Where email = ?`, email,
                function (err, results) {
                    if (results.affectedRows > 0) {
                        res.status(200).json({
                            message: `User ${email} deleted`,
                            info: results
                        })
                    } else {
                        res.status(404).json(`User ${email} not found`)
                    }
                }
            )
        })

module.exports = router;
