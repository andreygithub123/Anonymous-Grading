const { message } = require("statuses");
//import modesl that are used in this route
const Project = require("../models/project");
const User = require('../models/user');
//express router
const express = require("express");
const project_router = express.Router();
// import Operations Op from sequelize
const { Op, FLOAT } = require("sequelize");

//Router to get all/post in projects
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

//Router to get/put(update)/delete a project based on it's unique ID
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
                const updatedProject = await project.update(req.body);  ///update the project with data from req.body
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
        try {
            const allEligibleUsers = await User.findAll(    //find all Eligible Users to be a jury
                {
                    where: {
                        type: ['Student', 'ProjectMember'],     // the user shoould be a Student/ProjectMember
                        [Op.or]: [
                            { foreignKeyTeam: { [Op.not]: req.params.id } }, // Check if it's not equal to req.params.id
                            { foreignKeyTeam: { [Op.is]: null } } // Check if it's null
                        ],
                        juryId: null     //!!!!!!!! Daca User1 este atribuit ca juriu echipei 1 si dupa random il atribuie echipei 2, no sa mai fie in jury la echipa 1
                    }
                })
            //test
            if (allEligibleUsers) {         //if we find those eligible users we need to form a jury of 4 made of random users 
                const randomlySelectedUsers = getRandomId(allEligibleUsers, 4);
                // Update the juryId attribute to the id of the project for each randomly selected user
                await Promise.all(randomlySelectedUsers.map(async (user) => {
                    await user.update({ juryId: req.params.id });   //we update the field juryId with the id of the project
                }));                                                // so each jury will be a jury to to a project
                //!!!!!!!! Daca User1 este atribuit ca juriu echipei 1 si dupa random il atribuie echipei 2, no sa mai fie in jury la echipa 1
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

//Router to let the professor see the grades of a project and calculate automatically the avergae excluding the mina nd the amx from the gradsArray
project_router
    .route("/projects/:projectId/professor/:password/seeGrades")
    .get(async (req, res, next) => {
        try {
            const professor = await User.findAll(   // Our porject is made to run With only one professor
                {
                    where: {
                        type: ['Professor'],
                    }
                })
            const project = await Project.findByPk(req.params.projectId);
            if (professor[0].password === req.params.password) {                // If there are multiple professors logged in( by mistake an user loged in as professor)
                //parse the gradesString array into a Float Array               // We will consider the first one logged in to be the professor
                const gradesArray = JSON.parse(project.grades).map(parseFloat);         //The SQLITE does not allow to store arrays so i saved it as a string /then to parse it to obtain an array
                //return res.status(200).json(gradesArray); 

                //get the average of the grades excluding the biggest and the smallest one
                //functions to calculate the amx and the min of an array
                Array.prototype.max = function () {
                    return Math.max.apply(null, this);
                };
                Array.prototype.min = function () {
                    return Math.min.apply(null, this);
                };
                //save the max and min into variables
                const maxGrade = gradesArray.max();
                const minGrade = gradesArray.min();
                //exclude the biggesta nd smallest garde in the array
                const excludedGrades = gradesArray.filter(grade => grade !== maxGrade && grade !== minGrade);
                //calculate the average of the remaining values
                const averageGrades = excludedGrades.reduce((a, b) => a + b, 0) / excludedGrades.length;
                //return it 
                return res.status(200).json({ gradesArray, averageGrades });
            }
            else {
                return res.status(404).json({ message: 'The password is incorrect!' })//nu este 404 asta
            }
        }
        catch (err) {
            next(err);
        }

    })

//function to get random Id's from Users in order to create a jury
function getRandomId(usersArray, nbOfMembers) {
    const shuffledNames = [...usersArray].sort(() => Math.random() - 0.5);
    return shuffledNames.slice(0, nbOfMembers);
}

//Router to put grade for a project if you are Jury
project_router
    .route("/projects/:projectId/putGrade")
    .post(async (req, res, next) => {
        //The way to put the grades in the body of req
        // {
        //     "grades": "[1,2,3,4]"  // {grades: 10}
        //   }
        try {
            //get the rpoject with id = Url.id
            const project = await Project.findByPk(req.params.projectId);
            if (!project) {
                return res.status(404).json({ error: `Project with id ${req.params.projectId} not found` });
            }

            const gradeAsInteger = parseFloat(req.body.grades);
            console.log(gradeAsInteger);
            console.log(project.grades);

            if (project.grades === '') {
                project.grades = JSON.stringify(gradeAsInteger);
            } else {

                let intArray = JSON.parse(project.grades);
                console.log(intArray);
                console.log(typeof intArray);


                //if 2 or more elements in grades : project.grades => int array
                //console.log(intArray); // Output: [5, 3]
                if (typeof intArray === 'object') {
                    console.log(gradeAsInteger);
                    console.log(typeof intArray);
                    intArray.push(gradeAsInteger);
                    console.log(intArray);
                    project.grades = JSON.stringify(intArray);
                }
                else if (typeof intArray === 'number') { //1 element case : project.grades => number
                    const resultArray = [];
                    resultArray.push(intArray);
                    resultArray.push(gradeAsInteger);
                    project.grades = JSON.stringify(resultArray);
                }

            }

            await project.save();
            return res.status(200).json(project);
        }
        catch (err) {
            next(err);
        }

    })

project_router
    .route("/projects/:projectId/modifyGrade")
    .post(async (req, res, next) => {
        try {
            //get the rpoject with id = Url.id
            const project = await Project.findByPk(req.params.projectId);
            if (!project) {
                return res.status(404).json({ error: `Project with id ${req.params.projectId} not found` });
            }

            const newGrade = parseFloat(req.body.newGrade);
            const oldGrade = parseFloat(req.body.oldGrade);

            if(oldGrade !== null)
            {
                let intArray = JSON.parse(project.grades);
                console.log(intArray);
                console.log(typeof intArray);

                if (typeof intArray === 'object') {
                    console.log(oldGrade);
                    console.log(newGrade);
                    console.log(typeof intArray);

                    for(let i=0 ; i< intArray.length; i++)
                    {
                        if(intArray[i] === oldGrade)
                        {

                            intArray[i] = newGrade;
                            break;
                        }
                        
                    }
                    console.log(intArray);
                    project.grades = JSON.stringify(intArray);
                }
            }
            else if (typeof intArray === 'number')
            {
                    const resultArray = [];
                    resultArray.push(newGrade);
                    project.grades = JSON.stringify(resultArray);
            }
            await project.save();
            return res.status(200).json(project);
        }
        catch (err) {
            next(err);
        }

    })



//const gradesArray = JSON.parse(project.grades).map(parseFloat);
function putGrade(projectGradesAsFloatArray, grade) {
    projectGradesAsFloatArray.push(grade);

}

//export the router
module.exports = project_router;