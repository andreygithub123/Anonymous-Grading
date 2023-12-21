import './App.css';
import { BrowserRouter, Routes, Route,Link } from 'react-router-dom';
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { About} from "./components/About";

function App() {
  return <BrowserRouter>
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">


          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/"  className="nav-link px-2 text-white">Home</Link></li>
            <li><Link href="#" className="nav-link px-2 text-white">Features</Link></li>
            <li><Link to="/about" className="nav-link px-2 text-white">About</Link></li>
          </ul>


          <div className="text-end">
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-outline-light me-2">Register</Link>
          </div>
        </div>
      </div>
    </header>







    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element = {<About />} />
    </Routes>
  </BrowserRouter>


}

export default App;
