import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
    const [name,setName] = useState('');

    useEffect (  () => {
        (async() => {
            const {data} = await axios.get ('http://localhost:8080/login');
            setName(data.fullName);
        })();
    },  []);
    return <div className="form-signin mt-5 text-center">
        <h3>Hi {name}</h3>
    </div> 
}