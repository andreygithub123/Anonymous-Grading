const { message } = require("statuses");
const Project = require("../models/project");
const { Op } = require("sequelize");
const User = require('../models/user');

const express = require("express");
const project_router = express.Router();

project_router
    .route("/projects")
    .get(async (req, res, next) => {
        try {
            const projects = await Project.findAll();
            return res.status(200).json(projects);
        }
        catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const newProject = await Project.create(req.body);
            return res.status(200).json(newProject);
        }
        catch (err) {
            next(err);
        }
    })

project_router
    .route("/projects/:id")
    .get(async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (project) { return res.status(200).json(project); }
            else { return res.status(404).json({ message: `Project with id ${req.params.id} not found` }); }
        }
        catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (project) {
                const updatedProject = await project.update(req.body);
                return res.status(200).json(updatedProject);
            }
            else { return res.status(404).json({ message: `Project with id ${req.params.id} not found` }); }
        }
        catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (project) {
                await project.destroy();
                return res.status(200).json({ message: `Project with id ${project.id} has been deleted!` });
            }
            else {
                return res.status(404).json({ message: `Project with id ${req.params.id} not found!` });
            }
        }
        catch (err) {
            next(err);
        }
    })

// Implementation of the method of adding Jury to a project using it's id
project_router
    .route('/projects/:id/addJury')
    .get(async (req, res, next) => {
        //filtrare 
        //user id != project .id
        // gen trb sa salvam la fiecare User care isJury un id al prooiectului respectiv
        try {
            const allEligibleUsers = await User.findAll(
                {
                    where: {
                        type: ['Student', 'ProjectMember'],
                        foreignKeyTeam: {
                            [Op.not]: req.params.id // Negating the condition for foreignKeyTeam
                        }
                    }
                })
            //test
            if (allEligibleUsers) {
                const randomlySelectedUsers = getRandomId(allEligibleUsers, 4);
                // Update the juryId attribute to the id of the project for each randomly selected user
                await Promise.all(randomlySelectedUsers.map(async (user) => {
                    await user.update({ juryId: req.params.id });
                }));

                return res.status(200).json(randomlySelectedUsers);
            }
            else {
                return res.statys(404).json({ message: 'Error' });
            }
        }
        catch (err) {
            next(err);
        }

    })

project_router
    .route("/projects/:projectId/professor/:password/seeGrades")   
    .get(async(req,res,next)=>{
       try{
        const professor = await User.findAll(
            {
                where: {
                    type: ['Professor'],   
                }
            })
        const project = await Project.findByPk(req.params.projectId);
        if(professor[0].password === req.params.password ) 
        {
            //parse the gradesString array into a Float Array
            const gradesArray = JSON.parse(project.grades).map(parseFloat);
            return res.status(200).json(gradesArray); 
            
            //plus ca aici trb sa omiterm cea mai amre nota si cea mai mica
            // si dupa sa facem media
            //cum excluzi cea mai mare si cea mai mica asa le obtii ))) bn hai ceau
            
        }
        else
        {
            return res.status(404).json({message:'The password is incorrect!'})//nu este 404 asta
        }
       }
       catch(err)
       {
        next(err);
       }

    })

    function getRandomId(usersArray, nbOfMembers) {
        const shuffledNames = [...usersArray].sort(() => Math.random() - 0.5);
        return shuffledNames.slice(0, nbOfMembers); }

module.exports = project_router;