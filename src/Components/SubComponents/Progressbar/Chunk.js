import React, { useState } from "react";

const Chunk = ({ start, end, duration, progressTime, color, topic }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = [ "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0", "#808080", "#FFFFFF", "#000000" ];

  //let randomColors = colors[Math.floor(Math.random() * colors.length)];

  const chunkWidth = `${((end - start) / duration) * 100}%`;
  const chunkLeft = `${(start / duration) * 100}%`;

  const chunkStyle = {
    width: chunkWidth,
    left: chunkLeft,
    backgroundColor: "darkgrey",
    position: "absolute"
  };

  return (
    <div
      className="chunk"
      style={chunkStyle}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {isHovered && <p id="topic">{topic}</p>}
    </div>
  );
};

export default Chunk;





/*
import React, { useState } from "react";

const Chunk = ({ start, end, duration, progressTime, color, topic }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = [ "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0", "#808080", "#FFFFFF", "#000000" ];

  //let randomColors = colors[Math.floor(Math.random() * colors.length)];

  const chunkWidth = `${((end - start) / duration) * 100}%`;
  const chunkLeft = `${(start / duration) * 100}%`;

  const chunkStyle = {
    width: chunkWidth,
    left: chunkLeft,
    backgroundColor: color,
    position: "absolute"
  };

  return (
    <div
      className="chunk"
      style={chunkStyle}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {isHovered && <p id="topic">{topic}</p>}
    </div>
  );
};

export default Chunk;
*/