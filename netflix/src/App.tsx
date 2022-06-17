import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Movie from "./Routes/Movie";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/movies" element={<Movie />} />
        <Route path="/tv_shows" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />}>
          <Route path="movie/:contentId" />
          <Route path="tv/:contentId" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
