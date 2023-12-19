import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const Home = () => {
    const [name,setName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [navigate, setNavigate] = useState(false);
    const token = localStorage.getItem("token");
 
    axios.get("http://localhost:8080/login", {
        headers: {
            "x-access-token" : token
        }



    })

    const showTeam= () => {
        console.log(teamName);
    }

    const handleLogout = () => {
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
                        <button className="btn btn-outline-secondary " type="button" onClick={showTeam}>Add</button>
                        <button className="btn btn-outline-secondary " type="button">Join</button>
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

