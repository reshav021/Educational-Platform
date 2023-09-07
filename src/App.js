import React from 'react';
import Header from './Components/Header';
import Content from './Components/Content';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoDetails from './Components/SubComponents/VideoDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Content/>} />
        <Route path="/videoDetails" element={<VideoDetails/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


/*
import React from 'react';
import Header from './Components/Header';
import Content from './Components/Content';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoDetails from './Components/SubComponents/VideoDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/style.css'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      
      <Routes>
        <Route path="/" element={<Content/>} />
        <Route path="/videoDetails" element={<VideoDetails/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/