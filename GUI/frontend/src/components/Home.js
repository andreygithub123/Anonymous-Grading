import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const Home = () => {
    const [name,setName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [navigate, setNavigate] = useState(false);
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
                const response = await axios.post("http://localhost:8080/teams", {
                    teamName: teamName
                });
        
                // Check the response for success or any other relevant data
                console.log("Response:", response.data);
            }
            catch(err)
            {
                console.error(err);
            }
            
        }
    }

    const setUserAsPM = async (e) => {
        if (token) {
            try {
                const userId = await getIdToken(token); // Assuming getIdToken returns the user ID
    
                    const response = await axios.put(`http://localhost:8080/users/getById/${userId}`,{type:"ProjectMember"});
                    console.log(response.data); // Check the response for success or any relevant data
            } catch (err) {
                console.error(err);
            }
        }
    };
    
    // const joinTeam= async e => {
    //     e.preventDefault();
    //     console.log(teamName);
    //     if(token)
    //     {
    //         const userId = getIdToken(token);
    //         try {
    //             const response = await axios.post("http://localhost:8080/teams", {
    //                 teamName: teamName
    //             });
        
    //             // Check the response for success or any other relevant data
    //             console.log("Response:", response.data);
    //         }
    //         catch(err)
    //         {
    //             console.error(err);
    //         }
            
    //     }
    // }

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
                    <div className="input-group-append ">
                        <button className="btn btn-outline-secondary " type="button" onClick={addTeam}>Add</button>
                        <button className="btn btn-outline-secondary " type="button" onClick={setUserAsPM}>Join</button>
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

