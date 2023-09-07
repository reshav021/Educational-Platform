import axios from "axios"
import React, { useState, useEffect } from "react"
import VideoDetails from "../VideoDetails"
import ListChartVideoProgress from './ListChartVideoProgress'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function List(props) {
  let searchData = props.searchData

  const [myData, setMyData] = useState([])
  const [myAlllabel, setAllLabels] = useState(true)
  const [mylabel, setLabels] = useState(null)
  const [myallData, setmyallData] = useState([])

  let myDataLength, display = false
  let jsonPathCluster, jsonPath, labelCount = 0, allLabelCount = 0
  let [selectedTopic, setSelectedTopic] = useState(null)
  let uniqueId = Math.floor(Math.random() * 100) + 1; 

  if ("INDIA".includes(searchData)) {
    jsonPathCluster = "./india-cluster.json"
    jsonPath = './india.json'
  } 
  else if ("PHYSICS".includes(searchData)) {
    jsonPathCluster = "./physics-cluster.json"
    jsonPath = './physics.json'
  } 
  else if ("LAW".includes(searchData)) {
    jsonPathCluster = "./law-cluster.json"
    jsonPath = './law.json'
  }
  else {
    myDataLength = 0      // If that keyword doesn't exist
  }

  useEffect(() => {
    axios.get(jsonPathCluster).then((res) => setMyData(res.data))
  }, [searchData])

  useEffect(() => {
    axios.get(jsonPath).then((res) => setmyallData(res.data))
  }, [searchData])

  const [activeButton, setActiveButton] = useState(null);
  let [facultySelected, setFaculty] = useState('');
  let [subjectSelected, setSubject] = useState('');
  
  let allFacultyName = [], allSubjects = [];
  let [count, setCount] = useState(0);

  const [filterBtn, setfilterBtn] = useState(false)

  // Set the value of the label like India & Bengal
  const handleListClick = (event, labels, documents) => {
    setFaculty('')
    setSubject('')
    setSelectedTopic(labels)

    var currentButton = event.target;
    currentButton.style.backgroundColor = "grey";

    if(activeButton && activeButton !== currentButton) {
      activeButton.style.backgroundColor = "";
      activeButton.style.border = "";
      activeButton.style.height = ""
      activeButton.style.width = ""
    }

    setActiveButton(currentButton);
    setAllLabels(false);
    setLabels(labels);
  };

  const closeTranscript = () => {
    document.querySelector('#displayTranscript').style.display = 'none'
  }

  const closeFilterBtn = () => {
    document.querySelector('#displayFilter').style.display = 'none'
  }

  // Displaying the Description/Audio_Transcript of the video using a popover
  const renderDescriptionOverlay = (content) => {
    return (
      <OverlayTrigger
        trigger="click" rootClose placement="top"
        overlay={
          <Popover id={`displayTranscript`} style={{height:"260px",width:"252px",zIndex:0}}>
            <Popover.Header as="h3">
              Description
              <button id='closeTranscript' onClick={closeTranscript.bind(this)}><i class="fa fa-close"></i></button>
            </Popover.Header>
            <Popover.Body style={{height:"205px",width:"250px", overflowX:"hidden"}}>
              {content}
            </Popover.Body>
          </Popover>
        }
      > 
        <button id='descriptionBtn'>Description</button>
      </OverlayTrigger>
    )
  }

  // Download audio_transcript
  const downloadTxtFile = (title,transcript) => {
    const element = document.createElement('a');
    element.style.fontFamily = 'Arial';
    element.style.fontSize = '20px';
    element.style.textAlign = 'justify';
    
    const file = new Blob([transcript], {
      type: "text/html; charset=utf-8",
    });
  
    element.href = URL.createObjectURL(file);
    element.download = title + ".doc";
    document.body.appendChild(element);
    element.click();
  } 

  //Remove duplicate videos based on title
  const displayedTitles = [];

  // Display the video, watch video button and description
  const displayContent = (title,content,audio_transcript,videoFileName) => {
    if (!displayedTitles.includes(title)){      // Check if title already displayed/exist don't show that video
      count++;
      displayedTitles.push(title);
      
      // <video src={videoFileName} controls height="360px" width="100%" id='video-player'></video>

      return (
        <div className="displaylistContent">
          <h4 id="list-title">{title}</h4>
          <ListChartVideoProgress myTitle={title} myVideoFileName={videoFileName} showDiv={showDiv}/>
          {renderDescriptionOverlay(content)}
          <button id='view-VideoDetails' onClick={() => handleshowDiv(title, videoFileName)}>Watch Detailed Video</button> 
          <button id='downloadBtn' onClick={downloadTxtFile.bind(this,title,audio_transcript)}>Download Notes</button>
        </div>
      )
    }
  }

  const [showDiv, setShowDiv] = useState(false);
  const [myTitle, setTitle] = useState();
  const [myVideoFileName, setVideoFileName] = useState();

  // Set value for title & videoFileName for Watch Video 
  const handleshowDiv = (title,videoFileName) => {
    setShowDiv(true)
    setTitle(title)
    setVideoFileName(videoFileName)
  };

  const handlehideDiv = () => {
    setShowDiv(false)
    setTitle()
    setVideoFileName()
  }

  // Set the faculty which is selected in search input of Faculty
  const onFacultyChange = () => {
    let selectedTeacher = document.getElementById("inputValFaculty").value;

    if(selectedTeacher === "Default") 
      selectedTeacher = "";
    
    setFaculty(selectedTeacher)
  };

  // Set the subject which is selected in search input of Subject
  const onSubjectChange = () => {
    let selectedSubject = document.getElementById("inputValSubject").value;
    
    if(selectedSubject === "Default") 
      selectedSubject = "";
    
    setSubject(selectedSubject)
  };

  

  const handleFilterBtn = () => {
    setfilterBtn(true)
  }

  // Used to reset the filters
  const handleResetFilter = () => {
    document.getElementById("inputValFaculty").value = ''
    document.getElementById("inputValSubject").value = ''
    setFaculty('')
    setSubject('')
  }

  useEffect(() => {
    if(searchData !== '') {
      setFaculty('');
      setSubject('');
    }
  }, [searchData]);


  // Display only 5 sentences of a audio_transcript
  const extractFiveSentences = (inputText) => {
    const sentences = inputText.split('.');
    const validSentences = sentences.filter(sentence => sentence.trim() !== '');
  
    if (validSentences.length >= 5) {
      return validSentences.slice(0, 5).join('. ') + '.';
    } else {
      return validSentences.join('. ') + '.';
    }
  }

  // Display the filters
  const renderFilterOverlay = () => {
    return (
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom-end"
        overlay={
          <Popover id={`displayFilter`} style={{ height: "260px", width: "230px", zIndex: 0 }}>
            <Popover.Header as="h3" style={{display: "flex"}}>
              Filter
              <button id="resetBtn" onClick={handleResetFilter}>Reset</button>
              <button id='closeFilterBtn' onClick={closeFilterBtn.bind(this)}><i className="fa fa-close"></i></button>
            </Popover.Header>
            <Popover.Body style={{ height: "205px", width: "242.5px" }}>
              <div>
                <div className="selectedValue">
                  {facultySelected} {subjectSelected}
                </div>
                <div id='facultyFilter'>
                  Faculty
                  
                  <input id="inputValFaculty" list="select-faculty" placeholder="Search for faculty" onChange={onFacultyChange} />
                  <datalist id="select-faculty">
                    <option id="option-keyword" value="">Search for faculty</option>
                    {[...new Set(allFacultyName)].map((option, index) => (
                      <option key={index}>{option}</option>
                    ))}
                  </datalist>
                </div>

                <div id='subjectFilter'>
                  Subject

                  <input id="inputValSubject" list="select-subject" placeholder="Search for subject" onChange={onSubjectChange} />
                  <datalist id="select-subject">
                    <option id="option-keyword" value="">Search for subject</option>
                    {[...new Set(allSubjects)].map((option, index) => {
                      return <option key={index}> {option} </option>;
                    })}
                  </datalist>
                </div>
              </div>
            </Popover.Body>
          </Popover>
        }
      >
        <button id='filterBtn' onClick={handleFilterBtn}>Filter</button>
      </OverlayTrigger>
    );
  }

  // Adding condition for the filters
  const addfilter = (faculty, facultySelected, domain, subjectSelected) => {
    return (facultySelected === faculty && subjectSelected === domain) || 
      (facultySelected === faculty && subjectSelected === '') ||
      (facultySelected === '' && subjectSelected === domain) ||
      (facultySelected === '' && subjectSelected === '')
  }

  let allLabelsList = []
  
  if(myDataLength === 0){
    return (
      <h3 id='noResults'>No results found</h3>
    )
  }
  else{
    return (
      <div className="displayList">
        {/* Used to display videoDetails */}
        {showDiv && (
          <div id="overlay">
            <button id='closeBtn' onClick={handlehideDiv}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
            <VideoDetails myTitle={myTitle} myVideoFileName={myVideoFileName} showDiv={showDiv}/>
          </div>
        )}
  
        <div id="listView">
          {myallData.map((post) => {
            let { title, summary, faculty, domain } = post 

            allSubjects.push(domain.toUpperCase())
            allFacultyName.push(faculty.toUpperCase())
          })}
          {myData.map((post) => {
            let { labels, documents } = post
  
            labels = labels[0]
  
            
  
            documents.map((doc, i) => {
              let domain = doc.domain
              let faculty = doc.faculty
  
              //allSubjects.push(domain)
              //allFacultyName.push(faculty)
            })
  
            {/* Display the label buttons, here labels are India & Bengal */}
            return (
              <div className="displayLabelList">
                <button id="list-btn" onClick={(event) => handleListClick(event, labels, documents)}>
                  {labels}
                </button>
              </div>
            )
          })}
        </div>
  
        {/* Displaying all the data which exist in clustered file */}
        {myAlllabel && (
          <div className="list-content" id="list-content">
            <div className="labels-Data">
              {myData.map((post) => {
                
                let { labels, documents } = post
  
                labels = labels[0]
  
                return documents.map((doc, i) => {
                  let content
                  let title = doc.title
                  //let content = doc.content
                  //let domain = doc.domain
                  //let faculty = doc.faculty
                  
                  let videoFileName = './ImgVideoData' + '/video/' + doc.title + '.mp4'
                  //let videoFileName = './' + doc.title + '/' + doc.title + '.mp4'
                  //let videoFileName = './' + title + '/' + title + '.mp4'
  
                  let facultyName, domainName, transcript

                  {myallData.map((post) => {
                    let { title, summary, faculty, domain, audio_transcript } = post 

                    summary = summary[0].toUpperCase() + summary.slice(1,)
                    transcript = audio_transcript
  
                    if(doc.title === title){
                      content = extractFiveSentences(summary)
                      facultyName = faculty
                      domainName = domain
                    }
                  })}
  
                  let filters = addfilter(facultyName, facultySelected, domainName, subjectSelected)

                  allLabelCount = count                  
                  display = true
  
                  if(filters){
                    return (<div key={i}> {displayContent(title,content,transcript,videoFileName)} </div>)
                  }
                })
              })}
            </div>

            {display && (
              <div className="label-count">
                <h4 id='allResultstext'>All results: {allLabelCount}</h4>
                {renderFilterOverlay()}
              </div>
            )}
          </div>
        )}
  
        {/* Displaying the label data(India & Bengal) which has been clicked by user */}
        {mylabel && (
          <div className="list-content" id="list-content">       
            <div className="labels-Data">
              {myData.map((post) => {
                let { labels, documents } = post
  
                labels = labels[0]
  
                if(mylabel === labels) {
                  return documents.map((doc, i) => {
                    
                    let title = doc.title
                    allLabelsList.push(title)
                    //let content = doc.content
                    let content
                    //let domain = doc.domain
                    //let faculty = doc.faculty
                    let videoFileName = './ImgVideoData' + '/video/' + doc.title + '.mp4'
  
                    let facultyName, domainName, transcript 

                    {myallData.map((post) => {
                      let { title, summary, faculty, domain, audio_transcript } = post 
                      let newTitle = title

                      summary = summary[0].toUpperCase() + summary.slice(1,)
                      transcript = audio_transcript
    
                      if(doc.title === newTitle){
                        content = extractFiveSentences(summary)
                        facultyName = faculty
                        domainName = domain
                      }
                    })}
  
                    let filters = addfilter(facultyName, facultySelected, domainName, subjectSelected)

                    if(facultySelected !== '' || subjectSelected !== '')
                      labelCount = count
                    else
                      labelCount = count + 1
                    
                    display = true

                    if(filters)
                      return (<div key={i}> {displayContent(title,content,transcript,videoFileName)} </div>) 
                  })
                }
              })}
            </div>

            {display && (
              <div className="label-count">
                <h4 id='allResultstext'>All results for {selectedTopic}: {labelCount}</h4>
                {renderFilterOverlay()}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default List