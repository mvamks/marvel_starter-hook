import { Link, NavLink } from 'react-router-dom';
import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
                
                {/* <a href="#">
                    <span>Marvel</span> information portal
                </a> */}
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink 
                        // exact  - 5 версия
                        end //6 версия
                        //activeStyle={{'color': '#9f0013'}} - - 5 версия
                        style={({ isActive }) => ({color: isActive ? '#9f0013' :  'inherit'})}
                        to="/">Characters</NavLink></li>
                    /
                    <li><NavLink
                        style={({ isActive }) => ({color: isActive ? '#9f0013' :  'inherit'})}
                        to="/comics">Comics</NavLink></li>

                    {/* <li><a href="#">Characters</a></li>
                    /
                    <li><a href="#">Comics</a></li> */}
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;