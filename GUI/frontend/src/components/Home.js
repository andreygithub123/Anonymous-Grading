import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const Home = () => {
    const [name,setName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [navigate, setNavigate] = useState(false);
    const [teamId,setTeamId] = useState('');
    const token = localStorage.getItem("token");
 
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







                // if("'" + teamName +"'" === teamNameResponse)
                // {
                //     const response = await axios.post(`http://localhost:8080/teams/${teamId}/projectMembers`, {
                //         // fullName: user.data.fullName,
                //         // email : user.data.email,
                //         // password : user.data.password
                //         userId: userId
                //         });
                
                //         // Check the response for success or any other relevant data
                //         console.log("Response:", response.data);
                // }
                
                
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
                        <button className="btn btn-outline-secondary " type="button" onClick={addTeam}>Add</button>
                        <button className="btn btn-outline-secondary " type="button" onClick={joinTeam}>Join</button>
                    </div>
                </div>
            </div>
            <button className="btn btn-outline-secondary" type="button" onClick={handleLogout}>LOG OUT</button>
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

