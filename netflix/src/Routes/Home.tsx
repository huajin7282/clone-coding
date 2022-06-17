import { useState } from "react";
import { useQuery, useQueries } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  GetContentResult,
  getContents,
  GetVideoResult,
  getVideos,
  Content,
  Video,
} from "../api";
import { makeImagePath, makeVideoPath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background-color: black;
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

const Contents = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  top: -150px;
`;

const Slider = styled.div`
  position: relative;
  height: 300px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    padding: 0 60px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 7.6px;
  position: absolute;
  width: 100%;
  padding: 0 60px;
`;

const Angle = styled(FontAwesomeIcon)`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 44%;
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
  const movieMatch = useMatch("/movie/:contentId");
  const tvMatch = useMatch("/tv/:contentId");
  const match = movieMatch || tvMatch;
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState([0, 0, 0, 0]);

  const list = [
    { category: "movie", type: "popular", head: "Popular Movies" },
    { category: "movie", type: "top_rated", head: "Top Rated Movies" },
    { category: "tv", type: "popular", head: "Popular TV Shows" },
    { category: "tv", type: "top_rated", head: "Top Rated TV Shows" },
  ];

  const contents = useQueries(
    list.map((item) => {
      return {
        queryKey: [item.category, item.type],
        queryFn: () => getContents(item.category, item.type),
      };
    })
  );

  const { data: video } = useQuery<GetVideoResult>(
    ["video", match?.params.contentId],
    () =>
      getVideos(
        match?.pathname.split("/")[1] ?? "",
        match?.params.contentId ?? ""
      )
  );

  const handleIndex = (data: GetContentResult, side: number, idx: number) => {
    if (data) {
      const totalContents = data.results.length - 1;
      const maxIndex = Math.floor(totalContents / offset) - 1;

      side > 0
        ? (() => {
            rowVariants.hidden.x = window.outerWidth;
            rowVariants.exit.x = -window.outerWidth;
            setIndex((prev) =>
              prev.map((count, i) =>
                i === idx ? (count === maxIndex ? 0 : count + 1) : count
              )
            );
          })()
        : (() => {
            rowVariants.hidden.x = -window.outerWidth;
            rowVariants.exit.x = window.outerWidth;
            setIndex((prev) =>
              prev.map((count, i) =>
                i === idx ? (count === 0 ? maxIndex : count - 1) : count
              )
            );
          })();
    }
  };

  const onBoxClicked = (category: string, contentId: number) => {
    navigate(`/${category}/${contentId}`);
  };

  const onOverlayClicked = () => {
    navigate(-1);
  };

  const clickedContent =
    match &&
    contents
      .map((item) =>
        item.data.results.find(
          (content: Content) => String(content.id) === match.params.contentId
        )
      )
      .find((clicked) => clicked !== undefined);

  const videoKey =
    match &&
    video?.results.find((video: Video) => video.type === "Trailer")?.key;

  return (
    <Wrapper>
      {contents.some((result) => result.isLoading) ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              contents[0].data?.results[0].backdrop_path || ""
            )}
          >
            <Title>{contents[0].data?.results[0].title}</Title>
            <Overview>{contents[0].data?.results[0].overview}</Overview>
          </Banner>
          <Contents>
            {list.map((item, idx) => (
              <>
                <Slider>
                  <h1>{item.head}</h1>
                  <AnimatePresence initial={false}>
                    <Row
                      key={`${idx}_${index[idx]}`}
                      variants={rowVariants}
                      initial={rowVariants.hidden}
                      animate={rowVariants.visible}
                      exit={rowVariants.exit}
                      transition={{ duration: 1 }}
                    >
                      {contents[idx].data?.results
                        .slice(
                          offset * index[idx],
                          offset * index[idx] + offset
                        )
                        .map((content: Content) => (
                          <Box
                            layoutId={String(content.id)}
                            key={content.id}
                            onClick={() =>
                              onBoxClicked(item.category, content.id)
                            }
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            bgPhoto={makeImagePath(
                              content.backdrop_path,
                              "w500"
                            )}
                          >
                            <Info variants={infoVariants}>
                              <h4>{content.title || content.name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                  <Angle
                    onClick={() =>
                      handleIndex(contents[idx].data, -window.outerWidth, idx)
                    }
                    icon={faAngleLeft}
                    style={{ left: "16px" }}
                  />
                  <Angle
                    onClick={() =>
                      handleIndex(contents[idx].data, window.outerWidth, idx)
                    }
                    icon={faAngleRight}
                    style={{ right: "16px" }}
                  />
                </Slider>
              </>
            ))}
          </Contents>
          <AnimatePresence>
            {match && (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Modal
                  layoutId={match?.params.contentId}
                  style={{ top: scrollY.get() + 100 }}
                >
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
                    <ModalTitle>{clickedContent.title}</ModalTitle>
                    <ModalOverview>{clickedContent.overview}</ModalOverview>
                  </>
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
