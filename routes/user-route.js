const User = require("../models/user");

const express = require("express");
const user_router = express.Router();

user_router
    .route("/users")
    .get(async(req,res) => {
        try{
            const users = await User.findAll();
            return res.status(200).json(users);
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    })
    .post(async (req,res) => {
        try{
            const newUser = await User.create(req.body);
            return res.status(200).json(newUser);
        }
        catch(err)
        {
            return res.status(500).json(err)
        }
    });


user_router
    .route("/users/:id")
    .get(async(req,res) => {
        try{
            const user = await User.findByPk(req.params.id);
            if(user)
            {
                return res.status(200).json(user);
            }
            else
            {
                return res.status(404).json({message: `User with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    })
    .put(async(req,res) => {
        try{
            const user = await User.findByPk(req.params.id);
            if(user)
            {
                const updatedUser = await user.update(req.body);
                return res.status(200).json(updatedUser);
            }
            else
            {
                return res.status(404).json({message: `User with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    })
    .delete(async(req,res)=> {
        try{
            const user = await User.findByPk(req.params.id);
            if(user)
            {
                await user.destroy();
                return res.status(200).json(updatedUser);
            }
            else
            {
                return res.status(404).json({message: `User with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            return res.status(500).json(err);
        }
    })

module.exports = user_router;