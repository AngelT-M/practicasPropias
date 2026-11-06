import { Link } from "react-router-dom";


export default function NavBar(){

    return(
        <nav className="barra"> 
            <div className="logo">
                <p>LOGO </p>
            </div>
            <div></div>
            <div className="links">
                <Link className="lin btn" to="/">Inicio</Link>
                <Link className="lin btn" to="/editor">Editor</Link>
            </div>
        </nav>
    )

}
