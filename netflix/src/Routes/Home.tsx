import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { GetMovieResult, getMovies, GetVideoResult, getVideos } from "../api";
import { makeImagePath, makeVideoPath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 7.6px;
  position: absolute;
  width: 100%;
`;

const Angle = styled(FontAwesomeIcon)`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 80px;
  opacity: 0;
  ${Row}:hover ~ & {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
    transform: scale(1.3);
    cursor: pointer;
  }
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Modal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.darker};
  right: 0;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
`;

const ModalTitle = styled.h2`
  position: relative;
  top: -132px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 48px;
`;

const ModalOverview = styled.p`
  position: relative;
  top: -80px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: { x: 0 },
  exit: { x: -window.outerWidth },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.4,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    y: 40,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const { data: movieData, isLoading: movieLoading } = useQuery<GetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: videoData } = useQuery<GetVideoResult>(
    ["videos", movieMatch?.params.movieId],
    () => getVideos(movieMatch?.params.movieId ?? "")
  );

  const handleIndex = (side: number) => {
    if (movieData) {
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      side > 0
        ? (() => {
            rowVariants.hidden.x = window.outerWidth;
            rowVariants.exit.x = -window.outerWidth;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
          })()
        : (() => {
            rowVariants.hidden.x = -window.outerWidth;
            rowVariants.exit.x = window.outerWidth;
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
          })();
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => {
    navigate(-1);
  };

  const clickedMovie =
    movieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );

  const videoKey =
    clickedMovie &&
    videoData?.results.find((video) => video.type === "Trailer")?.key;

  return (
    <Wrapper>
      {movieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(movieData?.results[0].backdrop_path || "")}
          >
            <Title>{movieData?.results[0].title}</Title>
            <Overview>{movieData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false}>
              <Row
                key={index}
                variants={rowVariants}
                initial={rowVariants.hidden}
                animate={rowVariants.visible}
                exit={rowVariants.exit}
                transition={{ duration: 1 }}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={String(movie.id)}
                      key={movie.id}
                      onClick={() => onBoxClicked(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <Angle
                onClick={() => handleIndex(-window.outerWidth)}
                icon={faAngleLeft}
                style={{ left: "16px" }}
              />
              <Angle
                onClick={() => handleIndex(window.outerWidth)}
                icon={faAngleRight}
                style={{ right: "16px" }}
              />
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch && (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Modal
                  layoutId={movieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <iframe
                        width="100%"
                        height="480"
                        src={`${makeVideoPath(
                          videoKey ?? ""
                        )}? &autoplay=1&amp;playlist=${videoKey}&loop=1&controls=0`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                      <ModalTitle>{clickedMovie.title}</ModalTitle>
                      <ModalOverview>{clickedMovie.overview}</ModalOverview>
                    </>
                  )}
                </Modal>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
