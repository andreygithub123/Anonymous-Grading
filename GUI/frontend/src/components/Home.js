import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
    const [name,setName] = useState('');

    const token = localStorage.getItem("token");
 
    axios.get("http://localhost:8080/login", {
        headers: {
            "x-access-token" : token
        }
    })

    return <div className="form-signin mt-5 text-center">
        <h3>{token}</h3>
    </div> 

 }

