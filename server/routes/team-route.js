const { message } = require("statuses");
//get all models
const Team = require("../models/team");
const User =require("../models/user");
const Project = require('../models/project');

const express = require("express");
const team_router = express.Router();
// For parsing
const { FLOAT } = require("sequelize");

//RelationShips between models(!!!)
Team.hasMany(User);
User.belongsTo(Team);
Team.hasOne(Project);
Project.belongsTo(Team);

//Route to get/post teams
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
            console.log(newTeam);
            return res.status(200).json(newTeam);
        }
        catch(err)
        {
            next(err);
        }
    });

//Route to get/put(update)/delete teams based on thier unique ID
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

//FUNCTIONALITY!

//Router to post the ProjectMembers into a Team / get all the ProjectMembers form a team 
//This also creates the Users objects with foreignKeys = the id's of the team in which their are added
team_router
    .route("/teams/:id/projectMembers")
    .get(async (req,res,next) => {
        try{
            const team = await Team.findByPk(req.params.id, {
                include:[User]
            });
            if(team)
            {
                const users = await User.findAll({
                    where: {
                        foreignKeyTeam:team.id  //find all Users where foreignKeyTeam = team.id /id is comming from req.params.id
                    }
                });
                res.status(200).json(users);
                //res.status(200).json(team.Users);
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
                const userId = req.body;
                console.log(userId);
                const user = await User.findOne({
                    where: {
                        id :userId.userId 
                    }
                })
                if(user)
                {
                    await user.update({foreignKeyTeam: req.params.id});
                }
              
                                               //creates a new User with data from req.body
                // const projectMember = await User.create({       //initialize the TeamId and foreignKeyTeam with the team.id // 
                //     ...req.body,                                // foreingKeyTeam in order to persist the id after server is closed
                //     foreignKeyTeam : team.id,
                //     TeamId :team.id
                // });
                // await projectMember.save();                     // save the projectMember to persist in databse
                // console.log(projectMember );
                // res.status(200).json(projectMember);
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

//route to put the Project into a Team / get/post
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
                const project = await Project.findAll({
                    where: {
                        foreignKeyTeam:team.id  // search by foreignKEyTeam ( this is the attribute that persists)
                    }
                });
                res.status(200).json(project[0]);
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
            {                                                //creates a new Project with data from req.body
                const project = await Project.create({      //initialize the TeamId and foreignKeyTeam with the team.id // 
                    ...req.body,                             // foreingKeyTeam in order to persist the id after server is closed
                    foreignKeyTeam : team.id,
                    TeamId : team.id

                });
                project.TeamId = team.id;
                //const gradesArray = JSON.parse(project.grades).map(parseFloat);   // nu ne trebuie pt ca le adaugam din jury, nu direct aici
                //console.log(gradesArray);
                await project.save();                   //save the project to persist with changes in databse
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

//export modules to be used in server.js
module.exports = team_router;