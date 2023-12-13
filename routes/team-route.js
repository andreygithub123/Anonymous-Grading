const { message } = require("statuses");
const Team = require("../models/team");
const User =require("../models/user");
const Project = require('../models/project');

const express = require("express");
const { FLOAT } = require("sequelize");
const team_router = express.Router();

Team.hasMany(User);
User.belongsTo(Team);
Team.hasOne(Project);

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
//route to put the ProjectMembers into a Team
//this creates also the Users objects 
team_router
    .route("/teams/:id/projectMembers")
    .get(async (req,res,next) => {
        try{
            const team = await Team.findByPk(req.params.id, {
                include:[User]
            });
            if(team)
            {
                res.status(200).json(team.Users);
            }
            else
            {
                res.status(404).json( {message: `Team with id ${team.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })
    .post(async (req,res,next)=>{
        try{
            const team  = await Team.findByPk(req.params.id);
            if(team)
            {
                const projectMember = await User.create({
                    ...req.body,
                    key : team.id,
                    TeamId :team.id
                });
                await projectMember.save();
                console.log(projectMember );
                res.status(200).json(projectMember);
            }
            else
            {
                res.status(404).json({message: `Team with id ${team.id} not found!`})
            }
        }
        catch (err)
        {
            next(err);
        }

    })

//route to put the Project into a Team
//this creates also the Project objects 
team_router
    .route("/teams/:id/addProject")
    .get(async (req,res,next) => {
        try{
            const team = await Team.findByPk(req.params.id, {
                include:[Project]
            });
            if(team)
            {
                res.status(200).json(team.Projects);
            }
            else
            {
                res.status(404).json( {message: `Team with id ${team.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })
    .post(async (req,res,next)=>{
        try{
            const team  = await Team.findByPk(req.params.id);
            if(team)
            {
                const project = new Project(req.body);
                project.TeamId = team.id;
                const gradesArray = JSON.parse(project.grades).map(parseFloat);
                console.log(gradesArray);
                await project.save();
                console.log('project saved ' );
                res.status(200).json(project);
            }
            else
            {
                res.status(404).json({message: `Team with id ${team.id} not found!`})
            }
        }
        catch (err)
        {
            next(err);
        }

    })


module.exports = team_router;