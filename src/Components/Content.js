import axios from "axios"
import React, { useState, useEffect } from "react"
import SearchBar from "./SubComponents/SearchBar"
import Charts from "./SubComponents/PieChart/Charts"
import List from "./SubComponents/PieChart/List"

const Content = () => {
  const [myData, setMyData] = useState([])
  let [searchData, setSearchData] = useState("") //Search Value

  //List View & PieChart
  let showChartList = false
  let [showPieChartContent, setShowPieChartContent] = useState(false)
  let [showListContent, setShowListContent] = useState(true)

  const getSearchData = (data) => {
    data = data.toLowerCase()
    setSearchData(data)
  }

  // Getting the data from JSON file
  useEffect(() => {
    axios.get("data.json").then((res) => {
      setMyData(res.data)
    })
  }, [])

  const [isClicked, setIsClicked] = useState(false);

  const handleListContent = () => {
    setIsClicked(true);
    var listBtn = document.getElementById("listBtn");
    var pieChartBtn = document.getElementById("pieChartBtn");

    pieChartBtn.style.backgroundColor = "";     // Remove highlight from pieChartBtn
    listBtn.style.backgroundColor = "grey";

    setShowPieChartContent(false)
    setShowListContent(true)
  }

  useEffect(() => {
    setIsClicked(true); // Set isClicked to true when the component mounts
  }, []);

  const handlePieChartContent = () => {
    var pieChartBtn = document.getElementById("pieChartBtn");
    var listBtn = document.getElementById("listBtn");

    listBtn.style.backgroundColor = "";        // Remove highlight from listBtn
    pieChartBtn.style.backgroundColor = "grey";

    setShowListContent(false)
    setShowPieChartContent(true)
  }

  const displayListData = (searchData) => {
    return (
      <div className="list">
        <List searchData={searchData} />
      </div>
    )
  }

  const displayPieChartData = (searchData) => {
    return (
      <div className="PieChart">
        <Charts searchData={searchData} />
      </div>
    )
  }

  let uniqueId = Math.floor(Math.random() * 100) + 1;

  if(searchData) {
    document.querySelector('.searchFilter').style.paddingTop = "0.7rem";
    document.querySelector('.header').style.display = 'block'
  }

  return (
    <div className="container">
      <div className="header">
        <li className="navbar">
          <a id="header-content"></a>
          <a id="home" href="./">Home</a>
        </li>
      </div>
      {!searchData && (
        <div className="homepage-content">
          <p id="homepage-header">Educational Video Platform</p>
        </div>
      )}

      <div className="searchFilter">
        <div className="searchBar">
          <SearchBar onSubmit={getSearchData} />
        </div>
      </div>

      <div className="grid">
        {myData.map((item) => {
          if(searchData !== "") {
            showChartList = true
            
            //Getting data from JSON file which is stored myData, & accessing this by using map() -> {currentItems.map()}
            let { domain, title, duration, faculty, video_url, transcript } = item

            searchData = searchData.toUpperCase()
            domain = domain.toUpperCase()
            faculty = faculty.toUpperCase()
            title = title.toUpperCase()
          }
        })}
      </div>


      {showChartList && (
        <div className="chartList">
          <button id="listBtn" style={{ backgroundColor: isClicked ? "grey" : "" }} onClick={handleListContent} >List</button>
          <button id="pieChartBtn" onClick={handlePieChartContent}>Pie Chart</button>

          {showPieChartContent && <div key={uniqueId}>{displayPieChartData(searchData)}</div>}
          {showListContent && <div key={uniqueId+1}>{displayListData(searchData)}</div>}
        </div>
      )}
    </div>
  )
}

export default Content