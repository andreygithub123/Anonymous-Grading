const { message } = require("statuses");
const Project = require("../models/project");

const express = require("express");
const project_router = express.Router();

project_router
    .route("/projects")
    .get(async(req,res,next)=>{
        try{
            const projects = await Project.findAll();
            return res.status(200).json(projects);
        }
        catch(err)
        {
            next(err);
        }
    })
    .post(async(req,res,next)=>{
        try{
            const newProject = await Project.create(req.body);
            return res.status(200).json(newProject);
        }
        catch(err)
        {
            next(err);
        }
    })

project_router
    .route("/projects/:id")
    .get(async(req,res,next)=> {
        try{
            const project = await Project.findByPk(req.params.id);
            if(project)
                {return res.status(200).json(project);}
            else
                {return res.status(404).json({message:`Project with id ${req.params.id} not found`});}
        }
        catch(err)
        {
            next(err);
        }
    })
    .put(async(req,res,next) => {
        try{
            const project = await Project.findByPk(req.params.id);
            if(project)
                {   const updatedProject = await project.update(req.body);
                    return res.status(200).json(updatedProject);}
            else
                {return res.status(404).json({message:`Project with id ${req.params.id} not found`});}
        }
        catch(err)
        {
            next(err);
        }
    })
    .delete(async(req,res,next) => {
        try{
            const project = await Project.findByPk(req.params.id);
            if(project)
            {
                await project.destroy();
                return res.status(200).json({message : `Project with id ${project.id} has been deleted!`});
            }
            else
            {
                return res.status(404).json({message: `Project with id ${req.params.id} not found!`});
            }
        }
        catch(err)
        {
            next(err);
        }
    })

module.exports= project_router;