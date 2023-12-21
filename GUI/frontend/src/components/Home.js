import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const Home = () => {
    const [teamName, setTeamName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [navigate, setNavigate] = useState(false);
    const token = localStorage.getItem("token");
    const juryGenerated = localStorage.getItem("juryGenerated");
    const [userIsJury, setUserIsJury] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [grade, setGrade] = useState('');

    const [displayGrades, setDisplayGrades] = useState(false);
    const [seeLivrabile, setSeeLivrabile] = useState(false);
    const [gradesArray, setGradesArray] = useState([]);
    const [averageGrades, setAverageGrades] = useState([]);
    const [displayProjectName, setDisplayProjectName] = useState([]);
    const [displayLivrabilePartiale, setDisplayLivrabilePartiale] = useState([]);

    const [livrabilPartial, setLivrabilPartial] = useState('');
    const [projectNameLivrabil, setProjectNameLivrabil] = useState('');

   
    const getIdToken = async (useToken) => {
        try {
            if (useToken) {
                const response = await axios.get("http://localhost:8080/login", {
                    headers: {
                        "x-access-token": useToken
                    }
                });
    
                // Assuming the response contains user data
                console.log(response.data.userId);
                return response.data.userId;
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors if necessary
        }
    }

    const isJury = useCallback(async () => {
        if (token) {
          const userId = await getIdToken(token);
          try {
            const response = await axios.get(`http://localhost:8080/users/getById/${userId}`);
            if (response) {
              if (response.data.juryId !== null) {
                setUserIsJury(true);
              }
            } else {
              console.error("Couldn't find any user with that id!");
            }
          } catch (err) {
            console.error(err);
          }
        }
      }, [token, getIdToken, setUserIsJury]);

      useEffect(() => {
        const checkUserIsJury = async () => {
          if (token) {
            await isJury(); // Call function to check if the user is a professor
          }
        };
      
        checkUserIsJury();
      }, [token, isJury])
    
  

    const isProffesor = useCallback(async () => {
        if (token) {
          const userId = await getIdToken(token);
          try {
            const response = await axios.get(`http://localhost:8080/users/getById/${userId}`);
            if (response) {
              if (response.data.type === "Professor") {
                setUserRole('Professor');
              }
            } else {
              console.error("Couldn't find any user with that id!");
            }
          } catch (err) {
            console.error(err);
          }
        }
      }, [token, getIdToken, setUserRole]);

      useEffect(() => {
        const checkUserRole = async () => {
          if (token) {
            await isProffesor(); // Call function to check if the user is a professor
          }
        };
      
        checkUserRole();
      }, [token, isProffesor]);

 

   
    const addTeam= async e => {
        e.preventDefault();
        console.log(teamName);
        if(token)
        {
           
            try {
                if(teamName && projectName)
                {
                    const response = await axios.post("http://localhost:8080/teams", {
                        teamName: teamName
                    });
            
                    // Check the response for success or any other relevant data
                    console.log("TeamResponse:", response.data);
                    //setTeamId(response.data.id);
                    //localStorage.setItem('teamId', response.data.id);
                
                    const project = await axios.post(`http://localhost:8080/teams/${response.data.id}/addProject`,{
                        projectName:projectName
                    });
    
                    console.log("ProjectResponse:", project.data);
                }
              
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const setUserAsPM = async (userToken) => {
        if (userToken) {
            try {
                const userId = await getIdToken(userToken); 
                    const response = await axios.put(`http://localhost:8080/users/getById/${userId}`,{type:"ProjectMember"});
                    console.log(response.data); // Check the response for success or any relevant data
            } catch (err) {
                console.error(err);
            }
        }
    };
    
    const joinTeam= async e => {
        e.preventDefault();
        //console.log(teamName);
        if(token)
        {
            setUserAsPM(token);
            const userId = await getIdToken(token); 
            try {
                // const user = await axios.put(`http://localhost:8080/users/getById/${userId}`);
                //setTeamId(localStorage.getItem("teamId"));    
                const teams =await axios.get("http://localhost:8080/teams")
                for(let i=0; i < teams.data.length; i++) {
                    let team = teams.data[i];
                    if(team.teamName === "'" + teamName +"'")
                    {
                        console.log("User added in " + teamName);
                        const response = await axios.post(`http://localhost:8080/teams/${team.id}/projectMembers`, {
                        userId: userId
                        });
                
                        // Check the response for success or any other relevant data
                        console.log("Response:", response.data);
                    }
                }
                
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const addLivrabilPartial= async e => {
        e.preventDefault();
        if(token)
        {
            try{
                const projects = await axios.get("http://localhost:8080/projects")
                if(projects)
                {
                    for(let i=0; i < projects.data.length; i++) {
                        let projectName = projects.data[i].projectName;
                        if(projectName === projectNameLivrabil)
                        {
                            let projectId = projects.data[i].id;
                            const projectLivrabil = await axios.put(`http://localhost:8080/projects/${projectId}`,{
                                livrabilPartial: livrabilPartial
                            });
                            console.log(projectLivrabil.data);
                        }
                    }
                }
                else
                {
                    console.error("No projects found!");
                }

            }
            catch(err)
            {
                console.error(err);
            }
        }
    }
            

    const gradeProject= async e => {
        e.preventDefault();
        if(token)
        {
            const userId = await getIdToken(token);
            try{
                const user = await axios.put(`http://localhost:8080/users/getById/${userId}`, {
                    gradeForProject : grade
                });
                //console.log(user.data.gradeForProject);
                if(user)
                {
                    console.log(user.data);
                    console.log(user.data.gradeForProject);
                    const juryId = user.data.juryId;
                    const projects =await axios.get("http://localhost:8080/projects")
                    if(projects)
                    {
                        for(let i=0; i < projects.data.length; i++) {
                            let projectId = projects.data[i].id;
                            if(projectId === juryId)
                            {
                                console.log(projectId);
                                console.log(juryId);
                                //post gardes
                                 const response = await axios.post(`http://localhost:8080/projects/${projectId}/putGrade`,{
                                    grades: grade
                                 });
                                 console.log(response);
                            }
                        }
                    }else
                    {
                        console.error("No projects found!");
                    }
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }
    }


    const modifyGradeProject= async e => {
        e.preventDefault();
        if(token)
        {
            const userId = await getIdToken(token);
            try{
                const oldUser = await axios.get(`http://localhost:8080/users/getById/${userId}`);
                console.log(oldUser.data.gradeForProject);
                if(oldUser)
                {
                    console.log(oldUser.data);
                    console.log(oldUser.data.gradeForProject);
                    const juryId = oldUser.data.juryId;
                    const projects =await axios.get("http://localhost:8080/projects")
                    if(projects)
                    {
                        for(let i=0; i < projects.data.length; i++) {
                            let projectId = projects.data[i].id;
                            if(projectId === juryId)
                            {
                                console.log(projectId);
                                console.log(juryId);
                                console.log("-----------");
                                console.log(oldUser.data.updatedAt);
                                const currentDate = new Date();
                                const lastUpdatedDate = new Date(oldUser.data.updatedAt);
                                const differenceInMilliseconds = currentDate - lastUpdatedDate;
                                const differenceInMinutes = differenceInMilliseconds / (1000 * 60); // Convert milliseconds to minutes
                                console.log(differenceInMinutes);

                                if(differenceInMinutes <15)
                                {
                                    //post gardes
                                    const response = await axios.post(`http://localhost:8080/projects/${projectId}/modifyGrade`,{
                                    oldGrade: oldUser.data.gradeForProject,
                                    newGrade: grade
                                 });
                                 console.log(response);
                                }
                                else
                                {
                                    console.error("You cannot modify the grade after 15 minutes!");
                                }
                                
                            }
                        }
                        const user = await axios.put(`http://localhost:8080/users/getById/${userId}`, {
                            gradeForProject : grade
                        });
                    }
                    else
                    {
                        console.error("No projects found!");
                    }
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }
    }


    const generateJury= async e => {
        e.preventDefault();
        if(token)
        {
            const userId = await getIdToken(token); 
            try {
                const user = await axios.put(`http://localhost:8080/users/getById/${userId}`);
                if(user.data.type === "Professor")
                {
                    console.log("Professor clicked generateJury");
                    localStorage.setItem("juryGenerated", true);
                    const projects =await axios.get("http://localhost:8080/projects")
                    if(projects)
                    {
                        for(let i=0; i < projects.data.length; i++) {
                            let projectId = projects.data[i].id;
                            const randomlySelectedUsers = await axios.get(`http://localhost:8080/projects/${projectId}/addJury`);
                            console.log(`The randomly selected jury for project ${projects.data[i].projectName} are: \n`);
                            console.log(randomlySelectedUsers.data);
                            
                        }
                    }else
                    {
                        console.error("No projects found!");
                    }
                  
                }
                else
                {
                    console.error("You try to generate the jury with type Studetn/PM. Log in as professor")
                }
                
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const gradesSeeCalculate= async e => {
        e.preventDefault();
        if(token)
        {
            const userId = await getIdToken(token); 
            try {
                const user = await axios.put(`http://localhost:8080/users/getById/${userId}`);
                if(user.data.type === "Professor")
                {
                    const profPassword = user.data.password;
                    const projects =await axios.get("http://localhost:8080/projects")
                    if(projects)
                    {
                        const allGrades = []; // Array to hold all project grades
                        const allAverages = []; // Array to hold all average grades
                        const allProjectNames = []; // Array to hold all proj names
                        const allLivrabilePartiale = [];
                        for(let i=0; i < projects.data.length; i++) {
                             let projectId = projects.data[i].id;
                             const projectGrades = await axios.get(`http://localhost:8080/projects/${projectId}/professor/${profPassword}/seeGrades`);
                             //{ gradesArray, averageGrades }
                            console.log(`The grades of the project with id : ${projectId} : `);
                            console.log(projects.data[i].projectName);
                            console.log(projectGrades.data.gradesArray);
                            console.log(projectGrades.data.averageGrades);
                            allProjectNames.push(projects.data[i].projectName);
                            allGrades.push(projectGrades.data.gradesArray);
                            allAverages.push(projectGrades.data.averageGrades);
                            allLivrabilePartiale.push(projects.data[i].livrabilPartial);

                           
                        }
                        setGradesArray(allGrades);
                        setAverageGrades(allAverages);
                        setDisplayProjectName(allProjectNames);
                        setDisplayLivrabilePartiale(allLivrabilePartiale);
                        setDisplayGrades(true);
                        setSeeLivrabile(false);
                    }else
                    {
                        console.error("No projects found!");
                    }
                  
                }
                else
                {
                    console.error("You try to generate the jury with type Studetn/PM. Log in as professor")
                }
                
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const seeLivrabilePartiale= async e => {
        e.preventDefault();
        if(token)
        {
            const userId = await getIdToken(token); 
            try {
                const user = await axios.put(`http://localhost:8080/users/getById/${userId}`);
                if(user.data.type === "Professor")
                {
                    const profPassword = user.data.password;
                    const projects =await axios.get("http://localhost:8080/projects")
                    if(projects)
                    {
                        const allProjectNames = []; // Array to hold all proj names
                        const allLivrabilePartiale = [];
                        for(let i=0; i < projects.data.length; i++) {
                             let projectId = projects.data[i].id;
                             const projectGrades = await axios.get(`http://localhost:8080/projects/${projectId}/professor/${profPassword}/seeGrades`);
                             //{ gradesArray, averageGrades }
                            console.log(`The grades of the project with id : ${projectId} : `);
                            console.log(projects.data[i].projectName);
                            allProjectNames.push(projects.data[i].projectName);
                            allLivrabilePartiale.push(projects.data[i].livrabilPartial);

                           
                        }
                        setDisplayProjectName(allProjectNames);
                        setDisplayLivrabilePartiale(allLivrabilePartiale);
                        setSeeLivrabile(true);
                        setDisplayGrades(false);
                        
                    }else
                    {
                        console.error("No projects found!");
                    }
                  
                }
                else
                {
                    console.error("You try to generate the jury with type Studetn/PM. Log in as professor")
                }
                
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem("token");
        if(!localStorage.token)
        {

            setNavigate(true);
        }
    }

    if (navigate) {
        return <Navigate to="/" />
      }

    if(token)
    {
    return (
        <form style={{ maxWidth: "1100px", margin: "auto" }}>
            <div className="text-center">
                <div className="text-center mt-5">
                <button className="btn btn-outline-danger" type="button" style={{fontSize:"25px"}} onClick={handleLogout}>LOG OUT</button>
                <p className="logout-text">Use this to log out user</p>
                </div>   
            </div>
             
            <>
            {userRole === 'Professor'   ? (    
                <div className="container">
                    <div className="text-center mt-5">
                        <button className="btn btn-outline-primary" type="button" style={{fontSize:"25px"}} onClick={seeLivrabilePartiale}>DISPLAY Livrabile Partiale</button>
                        <button className="btn btn-outline-warning" type="button" style={{fontSize:"25px"}} onClick={generateJury}>GENERATE JURY</button>
                        <button className="btn btn-outline-dark" type="button" style={{fontSize:"25px"}} onClick={gradesSeeCalculate}>DISPLAY / CALCULATE GRADES</button>
                        <p className="professor-text">WORKS ONLY FOR PROFESSOR USER TYPE</p>
                    </div>
                     {/* Display livrabile section */}
                     {seeLivrabile && (displayGrades === false) && (
                        <div className="text-center mt-5">
                        <h2>Livrabile Partiale</h2>
                        {displayProjectName.map((projectName, index) => (
                            <div key={index}>
                            <p>{projectName} | Livrabile: {displayLivrabilePartiale[index]} </p>
                            </div>
                            ))}
                        </div>
                    )}    
                    {/* Display grades section */}
                    {displayGrades && (seeLivrabile === false) && (
                        <div className="text-center mt-5">
                        <h2>Display / Calculate Grades</h2>
                        {displayProjectName.map((projectName, index) => (
                            <div key={index}>
                            <p>{projectName} | Livrabile: {displayLivrabilePartiale[index]} | Grades: {gradesArray[index].join(", ")} | Average Grade: {averageGrades[index]} </p>
                            </div>
                            ))}
                        </div>
                    )}                
                </div>
            ) : (
            <div className="container">
                <div className="input-group input-group-lg mt-5 text-center">
                    <span className="input-group-text" id="inputGroup-sizing-lg">Team name:</span>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        onChange={e=> setTeamName(e.target.value)}
                    />
                    <span className="input-group-text" id="inputGroup-sizing-lg">Project name:</span>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        onChange={e=> setProjectName(e.target.value)}
                    />
                    <div className="input-group-append ">
                        <button className="btn btn-outline-success " type="button" style={{fontSize:"25px"}} onClick={addTeam}>ADD</button>
                        <button className="btn btn-outline-primary " type="button" style={{fontSize:"25px"}} onClick={joinTeam}>JOIN</button>
                    </div>
                </div>


                        <div className="input-group input-group-lg mt-5">
                    <span className="input-group-text" id="inputGroup-sizing-lg">Name:</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="USE THIS AFTER PROJECT IS DEFINED!"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-lg"
                            style={{maxWidth: "200px"}}
                            onChange={e=> setProjectNameLivrabil(e.target.value)}
                        />
                     <span className="input-group-text" id="inputGroup-sizing-lg">Livrabil:</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="USE THIS AFTER PROJECT IS DEFINED!"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-lg"
                            onChange={e=> setLivrabilPartial(e.target.value)}
                        />
                    <div className="input-group-append ">
                        <button className="btn btn-outline-success " type="button" style={{fontSize:"25px"}} onClick={addLivrabilPartial}>-</button>
                    </div>  
                </div>
                <p>Use this to deliver a livrabil partial after the project is inserted!</p>

                {juryGenerated && userIsJury &&(
                    <div className="text-center mt-5">
                        <h2>Grade the Project</h2>
                        <p style={{backgroundColor:"red"}}>Grade only after the Professor generated the jury for each team!</p>
                        <p style={{backgroundColor:"lightblue"}}>Grades from 1 to 10</p>
                        <div className="input-group input-group-lg mt-2">
                            <span className="input-group-text" id="inputGroup-sizing-lg">Grade :</span>
                            <input
                            type="number"
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-lg"
                            onChange={e=> setGrade(e.target.value)}
                            min={1}
                            max={10}
                            />
                            <div className="input-group-append ">
                            <button className="btn btn-outline-primary " type="button" style={{fontSize:"25px"}} onClick={gradeProject}>SUBMIT GRADE</button>
                            <button className="btn btn-outline-primary " type="button" style={{fontSize:"25px"}} onClick={modifyGradeProject}>MODIFY GRADE</button>
                            </div>
                        </div>
                 </div>
                )}

                
            </div> 
                )}
           </>
           
        </form>         
        );
    }
    else
    {
        return (
            
            <div className="text-center">
                <div className="form-signin mt-5 text-center" style={{ backgroundColor: "red", margin: "auto" }}>
                    <h3 style={{ fontSize: "80px" }}>PLEASE LOG IN!</h3>
                </div>
            </div>
                
        );
    }
 

 }

