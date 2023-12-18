import { useState } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';


export const Login = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [navigate, setNavigate] = useState(false);


  const submit = async e => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:8080/login", {
            email: email,
            password: password
        });

        console.log(response);
        
        //save the token in the localStorage!
        localStorage.setItem("token", response.data.token);
        // Assuming the server responds with a success message or a token
        // You can set user authentication state or handle as needed

        setNavigate(true);
    } catch (error) {
        // Handle login error, display error message, etc.
        console.error("Error logging in:", error);
    }
}


  if (navigate) {
    return <Navigate to="/" />
  }

   
  return <main className="form-signin w-100 m-auto">
    <form onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

      <div className="form-floating">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
        onChange={e => setEmail(e.target.value)} />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating">
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
          onChange={e => setPassword(e.target.value)}/>
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>

    </form>
  </main>
}