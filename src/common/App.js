import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import './styles/styles.css';
import './styles/animations.css';
import './styles/custom-elements.css';

export default function App() {
	return (<>
		<header>
			<nav className="navigation">
				<ul>
				<li>
					<NavLink to={ROUTES.books()}>
					Books
					</NavLink>
				</li>
				<li>
					<NavLink to={ROUTES.movies()}>
					Movies
					</NavLink>
				</li>
				<li>
					<NavLink to={ROUTES.songs()}>
					Songs
					</NavLink>
				</li>
				</ul>
			</nav>
		</header>

		<main>
			<h1>Hello, World!</h1>
			<Outlet />
		</main>

		<footer></footer>
	</>);	  
}