const { message } = require("statuses");
const Team = require("../models/team");

const express = require("express");
const team_router = express.Router();

team_router
    .route("/teams")
    .get(async(req,res,next) => {
        try{
            const teams = await Team.findAll();
            return res.status(200).json(teams);
        }
        catch(err)
        {
            next(err);
        }
    })
    .post(async (req,res,next) => {
        try{
            const newTeam = await Team.create(req.body);
            return res.status(200).json(newTeam);
        }
        catch(err)
        {
            next(err);
        }
    });


team_router
    .route("/teams/:id")
    .get(async(req,res,next) => {
        try{
            const team = await Team.findByPk(req.params.id);
            if(team)
            {
                return res.status(200).json(team);
            }
            else
            {
                return res.status(404).json({message: `Team with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })
    .put(async(req,res,next) => {
        try{
            const team = await Team.findByPk(req.params.id);
            if(team)
            {
                const updatedTeam = await team.update(req.body);
                return res.status(200).json(updatedTeam);
            }
            else
            {
                return res.status(404).json({message: `Team with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })
    .delete(async(req,res,next)=> {
        try{
            const team = await Team.findByPk(req.params.id);
            if(team)
            {
                await team.destroy();
                return res.status(200).json({message : `Team with id ${team.id} has been deleted!`});
            }
            else
            {
                return res.status(404).json({message: `Team with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })


module.exports = team_router;