import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const Home = () => {
    const [teamName, setTeamName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [navigate, setNavigate] = useState(false);
    const token = localStorage.getItem("token");
    const [userRole, setUserRole] = useState('');
    const [grade, setGrade] = useState('');

    const [displayGrades, setDisplayGrades] = useState(false);
    const [projectInfo,setProjectInfo] = useState([]);
    const [gradesArray, setGradesArray] = useState([]);
    const [averageGrades, setAverageGrades] = useState(0);
    const [displayProjectName, setDisplayProjectName] = useState('');

   
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

  //setProjectInfo([displayGrades,gradesArray,averageGrades]);
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
                        for(let i=0; i < projects.data.length; i++) {
                             let projectId = projects.data[i].id;
                             const projectGrades = await axios.get(`http://localhost:8080/projects/${projectId}/professor/${profPassword}/seeGrades`);
                             //{ gradesArray, averageGrades }
                            console.log(`The grades of the project with id : ${projectId} : `);
                            console.log(projectGrades.data.gradesArray);
                            setGradesArray(projectGrades.data.gradesArray);
                            console.log(projectGrades.data.averageGrades);
                            setAverageGrades(projectGrades.data.averageGrades);
                            setDisplayGrades(true);
                            setDisplayProjectName(projects.data[i].projectName);
                            console.log(projects.data[i].projectName);
                           
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

    const handleLogout = async () => {
        localStorage.clear();
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
            <form style={{ maxWidth: "900px", margin: "auto" }}>
            <div className="text-center">
                <div className="input-group input-group-lg mt-5">
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
            </div>
            <div className="text-center mt-5">
                <button className="btn btn-outline-danger" type="button" style={{fontSize:"25px"}} onClick={handleLogout}>LOG OUT</button>
                <p className="logout-text">Use this to log out user</p>
            </div>
            
            <>
                {userRole === 'Professor'   ? (
                <div className="container">
                    <div className="text-center mt-5">
                        <button className="btn btn-outline-warning" type="button" style={{fontSize:"25px"}} onClick={generateJury}>GENERATE JURY</button>
                        <button className="btn btn-outline-dark" type="button" style={{fontSize:"25px"}} onClick={gradesSeeCalculate}>DISPLAY / CALCULATE GRADES</button>
                        <p className="professor-text">WORKS ONLY FOR PROFESSOR USER TYPE</p>
                    </div>
                     {/* Display grades section */}
                        {displayGrades && (
                            <div className="text-center mt-5">
                            <h2>Display / Calculate Grades</h2>
                            <p> {displayProjectName} has the grades : {gradesArray.join(", ")} and the avergage : {averageGrades}</p>
                            
                            </div>
                        )}
                                    
                  </div>
                ) : (
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
                            </div>
                        </div>
                    
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
                <div className="form-signin mt-5 text-center" style={{ backgroundColor: "red" }}>
                    <h3>PLEASE LOG IN!</h3>
                </div>
            </div>
                
        );
    }
 

 }

