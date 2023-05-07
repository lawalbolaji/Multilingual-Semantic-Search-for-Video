/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-condition */
import React from "react";
import Player from "video.js/dist/types/player";
import videojs from "video.js";
import VideoPlayer from "./videoPlayer";
import axios, { AxiosResponse } from "axios";
// import FileUpload from "./VideoUplaod";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Fade, TextField } from "@mui/material";
import { format } from "date-fns";
import "videojs-youtube";
import "./App.css";

type VideoMeta = {
  src: string | null;
  mimeType: "video/mp4" | "video/ogg" | "video/youtube" | null;
  isUploading: boolean;
};

type SearchResult = {
  idx: number;
  start: number;
  text: string;
  cosine: number;
};

function App() {
  const playerRef = React.useRef<Player | null>(null);
  const [videoMeta, setVideoMeta] = React.useState<VideoMeta>();
  const [urlSearchVal, setUrlSearchVal] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

  const formatDuration = React.useCallback((durationInSeconds: number) => {
    const date = new Date(0);
    date.setSeconds(durationInSeconds);

    return format(date, "m:ss");
  }, []);

  const videoJsOptions = React.useMemo(() => {
    console.log({
      type: videoMeta?.mimeType,
      src: videoMeta?.src,
      techOrder:
        videoMeta?.mimeType === "video/youtube" ? ["youtube"] : undefined,
    });
    return {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          type: videoMeta?.mimeType,
          src: videoMeta?.src,
        },
      ],
      techOrder:
        videoMeta?.mimeType === "video/youtube" ? ["youtube"] : undefined,
    };
  }, [videoMeta]);

  // const onFileLoad = React.useCallback((file?: File) => {
  //   if (file !== undefined) {
  //     setVideoMeta(() => ({
  //       src: null,
  //       mimeType: null,
  //       isUploading: true,
  //     }));

  //     handleFileUpload(file);
  //   }
  // }, []);

  const handleVidIndexQuery = (search: string) => {
    axios
      .get(`/index`, {
        params: {
          search,
        },
        baseURL: import.meta.env.VITE_API_ENDPOINT,
      })
      .then((response: AxiosResponse) => {
        setSearchResults(() => [...response.data.results]);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const handleUrlVidSearch = (url: string) => {
    setVideoMeta(() => ({
      src: null,
      mimeType: null,
      isUploading: true,
    }));

    axios
      .get("/embed", {
        params: {
          url,
        },
        baseURL: import.meta.env.VITE_API_ENDPOINT,
      })
      .then((response: AxiosResponse) => {
        console.log(response);
        setVideoMeta((meta) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...meta!,
          src: response.data.video.url,
          mimeType: response.data.video.mime,
          isUploading: false,
        }));
      })
      .catch((e: any) => {
        console.log(e);
        setVideoMeta((meta) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...meta!,
          src: null,
          mimeType: null,
          isUploading: false,
        }));
      });
  };

  // const handleFileUpload = (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file, file.name);

  //   axios
  //     .post("/upload", formData, {
  //       baseURL: import.meta.env.VITE_API_ENDPOINT,
  //       headers: { "Content-Type": file.type },
  //     })
  //     .then((res: AxiosResponse) => {
  //       setVideoMeta((meta) => ({
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         ...meta!,
  //         src: res.data.video.url,
  //         mimeType: "video/mp4",
  //         isUploading: false,
  //       }));
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //       setVideoMeta((meta) => ({
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         ...meta!,
  //         src: null,
  //         mimeType: null,
  //         isUploading: false,
  //       }));
  //     });
  // };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div className="app-container">
      <div
        className="video-container"
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          className="getVidFromUrl"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              marginBottom: "2rem",
              fontWeight: 500,
              textAlign: "left",
              color: "var(--gray-600)",
            }}
          >
            Video Url
          </div>
          <div
            style={{
              width: "90%",
              boxSizing: "border-box",
            }}
          >
            <TextField
              fullWidth
              label="video url"
              id="fullWidth"
              value={urlSearchVal}
              onChange={(
                e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setUrlSearchVal(e.currentTarget.value);
              }}
            />
          </div>
          <div
            style={{
              width: "40%",
              boxSizing: "border-box",
              display: "inline-flex",
              marginTop: "1em",
              marginBottom: "1em"
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleUrlVidSearch(urlSearchVal);
                setUrlSearchVal("");
              }}
              disabled={urlSearchVal.length < 1}
            >
              Get Video
            </Button>
          </div>
        </div>
        {/* <div
          style={{
            width: "100%",
            display: "flex",
            height: "100px",
          }}
        >
          <FileUpload onFileLoad={onFileLoad} />
        </div> */}

        <div className="uploadVid">
          {videoMeta !== undefined && videoMeta.isUploading ? (
            <>
              <Box sx={{ height: 40 }}>
                <Fade
                  in={videoMeta !== undefined && videoMeta.isUploading}
                  style={{
                    transitionDelay:
                      videoMeta !== undefined && videoMeta.isUploading
                        ? "800ms"
                        : "0ms",
                  }}
                  unmountOnExit
                >
                  <CircularProgress />
                </Fade>
              </Box>
            </>
          ) : (
            <></>
          )}
          {videoMeta !== undefined && videoMeta.src !== null ? (
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className="query-container"
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              marginBottom: "2rem",
              color: "var(--gray-600)",
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            Search Query
          </div>
          <div
            style={{
              width: "90%",
              boxSizing: "border-box",
            }}
          >
            <TextField
              value={searchQuery}
              fullWidth
              label="type your search here"
              id="fullWidth"
              onChange={(
                e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setSearchQuery(e.currentTarget.value);
              }}
            />
          </div>
          <div
            style={{
              width: "40%",
              boxSizing: "border-box",
              display: "inline-flex",
              marginTop: "1em",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleVidIndexQuery(searchQuery);
              }}
              disabled={searchQuery.length < 1}
            >
              Lookup
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              fontWeight: 600,
              width: "80%",
              textAlign: "left",
            }}
          >
            Results
          </div>

          <hr style={{ width: "100%" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {searchResults.map((result, idx) => (
              <React.Fragment key={idx}>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    onClick={() => {
                      if (playerRef.current)
                        playerRef.current.currentTime(result.start);
                    }}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {formatDuration(result.start)} &nbsp; - &nbsp;{" "}
                    {result.text.slice(0, 35)}
                    {"..."}
                  </Button>
                </div>

                <hr style={{ width: "100%" }} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
