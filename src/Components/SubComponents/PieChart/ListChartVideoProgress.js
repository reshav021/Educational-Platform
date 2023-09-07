import axios from "axios"
import { BiFullscreen } from "react-icons/bi"
import ProgressBar from "../Progressbar/ProgressBar"
import React, { useState, useEffect, useRef } from "react"

function ListChartVideoProgress(props) {
  const [myData, setMyData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState(0)

  const chunks = []
  const videoRef = useRef() 
  
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [videotimeNow, setCurrentVideoTime] = useState(0) 
  const [displayKeywordContainer,setDisplayKeywordContainer] = useState(false)

  const progressTooltipRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenProgressBar, setfullscreenProgressBar] = useState(false)

  let showDiv = props.showDiv
  let localtitle = props.myTitle
  let videoFileName = props.myVideoFileName

  // Setting the API/JSON data
  useEffect(() => {
    axios.get("./india.json").then((res) => setMyData(res.data))
  }, [])

  // Function to remove duplicates appearing in the search input 
  const removeDuplicateKeywords = () => {
    const list = []
    const set = new Set()

    return {
      push(element) {
        if (!set.has(element)) {
          list.push(element)
          set.add(element)
        }
      },
      get() {
        return list
      },
    }
  }

  // Remove all duplicate keywords appearing in the search input 
  let allKeywords = removeDuplicateKeywords()

  // Takes us to give time duration in the video
  const handleSeekTo = (time) => {
    if(videoRef.current)
      videoRef.current.currentTime = time + 1
  }

  // Converting hh:mm:ss to seconds
  const toSeconds = (timeString) => {
    timeString = timeString + ""
    let time = timeString.split(":")

    let hr = parseInt(time[0], 10)
    let min = parseInt(time[1], 10)
    let sec = parseInt(time[2], 10)

    return hr * 3600 + min * 60 + sec
  }

  // Search a topic inside the video
  const handleSearch = () => {
    setDisplayKeywordContainer(true)
    let selectedkeyword = document.getElementById("inputVal").value
    selectedkeyword = selectedkeyword.toUpperCase()

    if(selectedkeyword === "Default") 
      selectedkeyword = ""
    setSearchKeyword(selectedkeyword)
  }

  const handleTimeUpdate = (newTime) => {
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Gives the entire video duration
  const handleDurationChange = () => {
    setDuration(videoRef.current.duration)
  }

  function handleTime() {
    setCurrentTime(videoRef.current.currentTime)
    setCurrentVideoTime(videoRef.current.currentTime)
  }

  let [displayProgresss, setdisplayProgresss] = useState(true) 

  // Function to adjust to fullscreen view
  const toggleFullScreen = async (event) => {
    setdisplayProgresss(false)
    const container = document.getElementById("video-container");
    const fullscreenApi = container.requestFullscreen || container.webkitRequestFullScreen ||
      container.mozRequestFullScreen || container.msRequestFullscreen;

    if(!document.fullscreenElement) {
      setFullscreen(true);
      fullscreenApi.call(container);
    } 
    else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Event handler to detect fullscreen mode changes
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setFullscreen(false);
    }
  };

  // Register the event listener
  document.addEventListener("fullscreenchange", handleFullScreenChange);

  // Removes the event listener when the component is unmounted/removed
  useEffect(() => {
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Shows time in correct format mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  // Display topic in the progressbar of video
  const displayTopic = (event) => {
    //document.getElementById('fullscreen-toggle-btn').style.display = 'none'
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const time = duration * percentage;
    let textToDisplay = '';

    for(let i=0;i<chunks.length;i++){
      let chunksData = chunks[i];

      if((time > chunksData.start) && (time < chunksData.end))
        textToDisplay = chunksData.topic
    }

    setfullscreenProgressBar(true)

    if(fullscreen === true && progressTooltipRef.current) {
      progressTooltipRef.current.style.display = "block";
      progressTooltipRef.current.style.left = `${event.clientX}px`;
      progressTooltipRef.current.style.top = `${rect.top - progressTooltipRef.current.offsetHeight}px`;
      progressTooltipRef.current.innerText = textToDisplay + " " + formatTime(time);
    }
  };
  
  // Hides the topic to be displayed when outside the fullscreen view
  const notdisplayTopic = () => {
    //document.getElementById('fullscreen-toggle-btn').style.display = 'block'
    setfullscreenProgressBar(false)

    if(fullscreen === true && progressTooltipRef.current) {
      progressTooltipRef.current.style.display = "none";
    }
  };

  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleProgress = () => {
      if (videoRef.current && !isNaN(videoRef.current.duration)) {
        setProgress(
          (videoRef.current.currentTime / videoRef.current.duration) * 100
        );
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleProgress);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleProgress);
      }
    };
  }, []);

  const handleProgressBarChange = (e) => {
    const progressBarValue = e.target.value;
    setProgress(progressBarValue);
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      const seekTime = (progressBarValue / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  return (
    <div className="listChartVideo-Progress">
      <div>
        {myData.map((post) => {
          let { title, faculty, domain, chapters_list, image_metadata } = post

          title = title.toUpperCase()
          faculty = faculty.toUpperCase()
          domain = domain.toUpperCase()
          localtitle = localtitle.toUpperCase()

          if(title === localtitle) {
            let len = Object.keys(chapters_list).length
            let timeStamp = []
            let imgSrc,imgFile

            for(let i = 1; i <= len; i++) {
              let obj = chapters_list[i]
              let startTime = obj[0]
              let endTime = obj[1]
              let keywords = obj[3]

              //let imageData = image_metadata[i].image_filename
              //let imagePath = imageData[0]
              //let imagePath = imageData[2]
              //let imagePath = imageData[i]

              let imagePath;

              let imageFilenames = image_metadata.image_filename;
              
              imagePath = imageFilenames[i-1]
              

              if(keywords === searchKeyword) {
                imgSrc = imagePath
                imgFile = title
              }

              keywords = keywords.toUpperCase()
              allKeywords.push(keywords)
              
              keywords = keywords.toUpperCase()

              let startTimeSeconds = toSeconds(startTime)
              let endTimeSeconds = toSeconds(endTime)

              //Random colors
              const colors = [ "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0", "#800000", "#FFA500", "#FFFFF0", ]

              const newChunk = {
                start: startTimeSeconds,
                end: endTimeSeconds - 1.5,
                //color: colors[Math.floor(Math.random() * colors.length)],
                color: "gray",
                topic: keywords,
              }

              chunks.push(newChunk)                 // Inserting all data related to a topic inside chunks[]
            }
          }
        })}
      </div>

      <div className="listChartVideo-video">
        <div className="row" id="video-container"> {/* Displaying video */}
          <video
            ref={videoRef}
            src={videoFileName}
            onTimeUpdate={handleTime}
            onDurationChange={handleDurationChange}
            height={359.6}
            controls
            onMouseMove={displayTopic}
            onMouseOut={notdisplayTopic}
            //onProgress={handleProgress}
            id="video-player"
          />

          <div id="top-overlay">
            <div>                       {/* Displaying progressbar on top of video */}
              <BiFullscreen                 
                id="fullscreen-toggle-btn"
                role="button"
                class="bi bi-fullscreen text-white text-outline"
                onClick={(event) => toggleFullScreen(event)}
              ></BiFullscreen>
            </div>
          </div>

          <div id="bottom-overlay">
            {fullscreenProgressBar && (
              <div id="progressTooltip" ref={progressTooltipRef}></div>
            )}

            {/*Blue color progressbar
            {displayProgresss && (
                <input id="progresss" type="range" min="0" max="100" value={progress} step="any" onChange={handleProgressBarChange}/>
            )}
            */}
          </div>
        </div>

        {/* Displaying the progress bar by sending data to ProgressBar.js file*/}
        <ProgressBar
          className="progressBar"
          id="normalProgressBar"
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={handleTimeUpdate}
          chunks={chunks}
          videotimeNow={videotimeNow}
          value={2}
        />
      </div>
    </div>
  )
}

export default ListChartVideoProgress