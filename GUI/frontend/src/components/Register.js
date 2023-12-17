import { useState } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom'

export const Register = () => {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(false);

    const submit = async e => {
        e.preventDefault();

        try {

            // Validate email format
            const emailPatternStudent = /@stud.ase.ro$/;
            const emailPatternProfessor = /@ie.ase.ro$/;
            if (emailPatternStudent.test(email)) {
                await axios.post("http://localhost:8080/users", {
                    fullName: name,
                    email: email,
                    password: password,
                    type: "Student"
                });

                setNavigate(true);
            } else if (emailPatternProfessor.test(email)) {
                await axios.post("http://localhost:8080/users", {
                    fullName: name,
                    email: email,
                    password: password,
                    type: "Professor"
                });
                setNavigate(true);
            } else {
                // Display an error message or prevent form submission
                console.error('Invalid email domain. Please use valid domain email!');
                return;
            }

        } catch (error) {
            // Handle error, you may want to display an error message to the user
            console.error("Error creating user:", error);
        }
    }

    if (navigate) {
        return <Navigate to="/login" />
    }

    return <main className="form-signin w-100 m-auto">
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please register</h1>

            <div className="form-floating">
                <input className="form-control" placeholder="name"
                    onChange={e => setName(e.target.value)} />
                <label>Name</label>
            </div>

            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                    onChange={e => setEmail(e.target.value)} />
                <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                    onChange={e => setPassword(e.target.value)} />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">Submit</button>

        </form>
    </main>
}