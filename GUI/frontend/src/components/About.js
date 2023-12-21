
import axios from "axios";
import { Navigate } from "react-router-dom";

export const About = () => {

    return( 
        <div className="container" style={{maxWidth:"1000px", backgroundColor:"lightgrey"}}>
            <div className="text-center mt-5">
                <h1 style={{fontSize:"70px", fontFamily:"fantasy"}} >Anonymous Grading Project</h1>
            </div>
            <div className="mt-5">
                <h3>This application will allow users to register, save a project and join a team</h3>
                <h5>They can also save a partial task or send the finalized project</h5>
                <h5>The professor will then generate the jury to each project from all eligible users</h5>
                <h5>After the jury is generated, users can log in to see if they are part of any jury and grade the projects</h5>
                <h5>The grading system will omit the highest and the lowest grade</h5>
                <h5>The professor can then see anonymous grades, partial tasks and the avergae of the grades</h5>
            </div>
        </div>
        
    
    
    
    )
   
}