const { message } = require("statuses");
const User = require("../models/user");
const express = require("express");
const user_router = express.Router();

const jwt = require('jsonwebtoken');
const JWT = require("./JWT");

//Router for get/post/delete users 
user_router
    .route("/users")
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll();
            return res.status(200).json(users);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const newUser = await User.create(req.body);
            return res.status(200).json(newUser);
        }
        catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            // Delete all users from the database
            await User.destroy({
                where: {}, // Empty where clause deletes all records
                truncate: true // Reset the auto-incrementing counter
            });

            return res.status(200).json({ message: 'All users deleted successfully' });
        } catch (err) {
            next(err);
        }
    });


//Router fot get/put(update)/delete users based on thier unique ID
user_router
    .route("/users/getById/:id")
    .get(async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                return res.status(200).json(user);
            }
            else {
                return res.status(404).json({ message: `User with id ${req.params.id} not found!` });
            }
        }
        catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                const updatedUser = await user.update(req.body);
                return res.status(200).json(updatedUser);
            }
            else {
                return res.status(404).json({ message: `User with id ${req.params.id} not found!` });
            }
        }
        catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.destroy();
                return res.status(200).json({ message: `User with id ${user.id} has been deleted!` });
            }
            else {
                return res.status(404).json({ message: `User with id ${req.params.id} not found!` });
            }
        }
        catch (err) {
            next(err);
        }
    })

//Router to get all users with a specific type : [Student,ProjectMember,Professor]
user_router
    .route("/users/getByType/:type")
    .get(async (req, res, next) => {
        try {
            const typeUsers = await User.findAll({
                where: {
                    type: req.params.type
                }
            })
            if (typeUsers)
                return res.status(200).json(typeUsers);
            else
                return res.status(404).json({ message: `Users with type ${req.params.type} not found!` });
        }
        catch (err) {
            next(err);
        }
    })


user_router
    .route("/login")
    .post(async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email: email } });

            if (user && password === user.password) {
                // Passwords match, consider the user as authenticated

                //create a token using the function inJWT.js 
                const token = JWT.createTokens(user);
                return res.status(200).json({auth:true, token:token, result:user });
            } else {
                // Invalid email or password
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            next(error);
        }
    })
    .get(async (req, res, next) => {
        const token  =  req.headers["x-access-token"] ;
        console.log(token);
       try {
        const userId = await JWT.getIdFromToken(token);
        console.log(userId);
        return res.status(200).json({userId:userId});
        // Use userId for further processing
    } catch (error) {
        console.error('Error:', error);
    }
         
    });



//export module to be used in server.js
module.exports = user_router;