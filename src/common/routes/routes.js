import { createBrowserRouter, createRoutesFromElements } from "react-router-dom";

const ROUTES = {
	books: "/books",
	book: `/books/:bookId`,
	movies: "/movies",
	movie: `/movies/:movieId`,
	songs: "/songs",
	song: `/songs/:songId`,
  };

  // this is what will render in the Outlet of App
  export const routes = createBrowserRouter(createRoutesFromElements(
	<Route path="/" element={<App />}>
		{/*
			<Route index element={<Home />} />
			
			<Route path={ROUTES.books} element={<Books />} />
			<Route path={ROUTES.book} element={<Book />} />

			<Route path={ROUTES.movies} element={<Movies />} />
			<Route path={ROUTES.movie} element={<Movie />} />

			<Route path={ROUTES.songs} element={<Songs />} />
			<Route path={ROUTES.song} element={<Song />} />
  		*/}
	</Route>
  ))
  
  export default ROUTES;


// in the <Book /> component (for example):
// import { useParams } from 'react-router-dom'
// const { bookId }
  