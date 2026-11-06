import { Link } from "react-router-dom";


export default function Header(){

    return(
        <nav className="barra">
            <div>
                <h3>LOGO</h3>
            </div>
            <div>
                <Link to={'/'} >Editor</Link>
                <Link to={'/inicio'} >Inicio </Link>
            </div>
        </nav>


    )


}