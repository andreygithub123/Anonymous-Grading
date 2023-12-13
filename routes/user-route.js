const { message } = require("statuses");
const User = require("../models/user");
const express = require("express");
const user_router = express.Router();
const Team = require("../models/team")

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
                return res.status(200).json(typeUsers)
        }
        catch (err) {
            next(err);
        }
    })

user_router
    .route('/jury')
    .get(async (req, res, next) => {
        try {
            // Fetch users of type 'Student' or 'ProjectMember'
            const typeUsers = await User.findAll({
                where: {
                    type: ['Student', 'ProjectMember']
                }
            });

            if (typeUsers && typeUsers.length > 0) {
                // Update isJury attribute to true for each user
                await Promise.all(typeUsers.map(async (user) => {
                    await user.update({ isJury: true });
                }));

                return res.status(200).json(typeUsers);
            } else {
                return res.status(404).json({ message: 'No students or project members found' });
            }
        } catch (err) {
            next(err);
        }
    });



module.exports = user_router;