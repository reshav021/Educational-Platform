import React, { useRef, useState, useEffect } from "react";
import Chunk from "./Chunk";

const ProgressBar = ({ duration, onTimeUpdate, chunks, videotimeNow }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [progressTime, setProgressTime] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [exactProgress, setExactProgress] = useState(0);

  const progressBarRef = useRef(null);
  const progressBarWrapperRef = useRef(null);

  let chunksToShow = [];

  const uniqueTopics = chunks.reduce((acc, topic) => {
    if (!acc[topic.topic]) {
      acc[topic.topic] = { ...topic };
    } else {
      acc[topic.topic].end = topic.end;
    }
    return acc;
  }, {});

  chunks = Object.values(uniqueTopics).map((topic) => ({ ...topic, start: topic.start }));

  const handleProgressClick = (event) => {
    event.preventDefault();
    const progressBar = progressBarRef.current;
    const progressClicked = event.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (progressClicked / progressWidth) * duration;
    const newProgress = (progressClicked / progressWidth) * 100;
    setProgressTime(progressClicked);
    onTimeUpdate(newTime);
    setExactProgress(newProgress);
  };

  const progress = (exactProgress / 100) * duration;

  chunks.forEach((chunk) => {
    const chunkClass =
      progress >= chunk.start && progress <= chunk.end ? "chunk active" : "chunk";

    if (progress >= chunk.end) {
      chunksToShow.push(
        <div className={chunkClass} key={`${chunk.start}-${chunk.end}`} />
      );
    }
  });

  useEffect(() => {
    const progressBar = progressBarRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(progressBar.currentTime);
    };

    progressBar.addEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    const progressBarWrapper = progressBarWrapperRef.current;
    const handleResize = () => {
      setProgressWidth(progressBarWrapper.offsetWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [progressBarWrapperRef]);

  const renderChunks = () => {
    return chunks.map((chunk, index) => (
      <Chunk
        key={index}
        {...chunk}
        duration={duration}
        progress={progress}
      />
    ));
  };

  return (
    <div
      className="progress-bar-wrapper"
      ref={progressBarWrapperRef}
      onClick={handleProgressClick}
    >
      <div className="progress-bar" ref={progressBarRef}>
        {renderChunks()}
        <div
          className="progress-bar-thumb"
          style={{ left: `${videotimeNow}%` }}
        />
        {/* 
          <div className="exact-progress-bar" style={{ width: `${exactProgress}%` }}>
            <div className="exact-progress-bar-label">
              //{exactProgress.toFixed(2)}% 
              <div id='labelprogress-box'></div>
            </div>
          </div>
        */}
      </div>
    </div>
  );
};

export default ProgressBar;
