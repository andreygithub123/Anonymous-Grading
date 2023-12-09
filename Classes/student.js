
// Student class
// An instance of type Student will be created on Login with a unique id, a name, an email and a boolean atributte isJury that will determine if the student will be part of any jury.

class Student
{
    constructor(id,name,email,isJury)
    {
        this.id = id;
        this.name=name;
        this.email=email;
        this.isJury=isJury;
    }

    // This method checks if the email is of type student / Results a boolean value 
    checkEmail()
    {
        return this.email.includes('@stud.ase.ro');
    }
}


export default Student;

//Check

// stud  = new Student(1,'Alex','ion@prof.ase.ro',false)
// console.log(stud)
// console.log(stud.checkEmail())