import axios from "axios"
import React, { useState, useEffect } from "react"
import { PieChart, Pie, Label, Tooltip, Cell, Legend } from "recharts"
import VideoDetails from "../VideoDetails"
import ListChartVideoProgress from './ListChartVideoProgress'
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const Charts = (props) => {
  const searchData = props.searchData
  const [myData, setMyData] = useState([])
 
  const [OuterChartData, setOuterChartData] = useState([])

  const InnerColors = [ "#0088FE","#FF7F50","#00C49F","#6B8E23","#008080","#3CB371","#FF6384","#F2F2F2","#34495e","#f1c40f" ]
  const OuterColors = [ "#FF6384", "#36A2EB", "#483D8B", "#1abc9c", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e74c3c", "#95a5a6", "#2ecc71", "#8e44ad", "#d35400", "#7f8c8d", "#27ae60", ]

  const [selectedTopic, setSelectedTopic] = useState(null)
  const [myallData, setmyallData] = useState([])

  let flag = true, display = false
  let jsonPath, jsonPathCluster, myDataLength, innerlabelCount=0, allLabelCount=0
  // Used to set a random value for a key in a div 
  let uniqueId = Math.floor(Math.random() * 100) + 1; 

  let [showInnerContent, setShowInnerContent] = useState(false)
  let [showOuterContent, setShowOuterContent] = useState(false)
  let [showAllInnerContent, setShowAllInnerContent] = useState(true)

  let [count, setCount] = useState(0);
  let allFacultyName = [], allSubjects = [];
  let newOuterChartData = []

  const [selectedInnerData, setSelectedInnerData] = useState(null)
  const [selectedOuterData, setSelectedOuterData] = useState(null)

  // Set the data for outer piechart 
  /*
  useEffect(() => { 
    myData.forEach((post) => {
      let { labels,documents } = post

      for(let i=0; i<documents.length; i++) {
        let title = documents[i].title
        let titleCount = 1
        newOuterChartData.push({ title: title, count: titleCount })
      }
    })
    setOuterChartData(newOuterChartData)
  }, [myData])
  */
  
  let [displayOuterPieChartoverlay, setdisplayOuterPieChartoverlay] = useState(false)
  let [innerChartLabel, setinnerChartLabel] = useState(null)

  //Set data for inner clicked label in inner piechart
  const setDataOuterPiechart = (label) => {
    setinnerChartLabel(label)

    myData.forEach((post) => {
      let { labels,documents } = post

      if(label === labels[0]){
        for(let i=0; i<documents.length; i++) {
          let title = documents[i].title
          let titleCount = 1
          newOuterChartData.push({ title: title, count: titleCount })
        }
      }
    })
    setOuterChartData(newOuterChartData.slice(0,10))      // Retrive only 10 data from the cluster file
    setdisplayOuterPieChartoverlay(true)
  }

  // Set the selected data for inner piechart
  const handleInnerPieEnter = (data) => {
    setDataOuterPiechart(data.labels[0])
    setSelectedInnerData(data)
    setSelectedTopic(data.labels[0])
    setShowOuterContent(false)
    setShowAllInnerContent(false)
    setShowInnerContent(true)
  }

  // Set the selected data for outer piechart
  const handleOuterPieEnter = (data) => {
    setSelectedOuterData(data)
    setSelectedTopic(data.name)
    setShowInnerContent(false)
    setShowAllInnerContent(false)
    setShowOuterContent(true)
  }

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
    axios.get(jsonPath).then((res) => setmyallData(res.data))
  }, [searchData])

  useEffect(() => {
    axios.get(jsonPathCluster).then((res) => {
      const slicedData = res.data.slice(0, 10);  // Retrive only 10 data from the cluster file
      setMyData(slicedData);
    });
  }, [searchData]);

  

  const [myTitle, setTitle] = useState();
  const [showDiv, setShowDiv] = useState(false);
  const [myVideoFileName, setVideoFileName] = useState();

  // Set value for title & videoFileName for Watch Video 
  const handleshowDiv = (title,videoFileName) => {
    setShowDiv(true)
    setTitle(title)
    setVideoFileName(videoFileName)
  };

  // Hide outerPieChartCloseBtn
  const outerChartCloseBtn = () => {
    document.getElementById('outerPieChartoverlay').style.display = 'none'
    displayOuterPieChartoverlay = false
  }

  const handlehideDiv = () => {
    setShowDiv(false)
    setTitle()
    setVideoFileName()
  }

  const [facultySelected, setFaculty] = useState('');
  const [subjectSelected, setSubject] = useState('');

  const closeTranscript = () => {
    document.querySelector('#displayTranscript').style.display = 'none'
  }

  const closeFilterBtn = () => {
    document.querySelector('#displayFilter').style.display = 'none'
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

  // Adding condition for the filters
  const addfilter = (faculty, facultySelected, domain, subjectSelected) => {
    return (facultySelected === faculty && subjectSelected === domain) || 
      (facultySelected === faculty && subjectSelected === '') ||
      (facultySelected === '' && subjectSelected === domain) ||
      (facultySelected === '' && subjectSelected === '')
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

  const displayedTitles = [];

  // Display the video, watch video button and description
  const displayContent = (title,content,audio_transcript,videoFileName) => {
    if (!displayedTitles.includes(title)){    // Check if title already displayed/exist don't show that video
      count++;
      displayedTitles.push(title);
      
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

  const [selectedInnerSliceIndex, setSelectedInnerSliceIndex] = useState(null);
  const [selectedOuterSliceIndex, setSelectedOuterSliceIndex] = useState(null);
  
  // Used to display labels just outside the inner piechart
  const handleInnerSliceClick = (index) => {
    setFaculty('')
    setSubject('')
    setSelectedOuterSliceIndex(null);
    setSelectedInnerSliceIndex(index);
  };
  
  // Used to display labels just outside the outer piechart
  const handleOuterSliceClick = (index) => {
    setFaculty('')
    setSubject('')
    setSelectedInnerSliceIndex(null);
    setSelectedOuterSliceIndex(index);
  };

  // Used to reset the filters
  const handleResetFilter =() => {
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
            <Popover.Body style={{ height: "205px", width: "242.5px", overflow: "hidden" }}>
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
        <button id='filterBtn'>Filter</button>
      </OverlayTrigger>
    );
  }

  if(myDataLength === 0){
    return (
      <h3 id='noResults'>No results found</h3>
    )
  }
  else{
    return (
      <div key={uniqueId} className="displayPieChart">
        {myallData.map((post) => {
          let { title, summary, faculty, domain } = post 

          allSubjects.push(domain.toUpperCase())
          allFacultyName.push(faculty.toUpperCase())
        })}

        {myData.map((post) => {
          let { labels, documents } = post
  
          labels = labels[0]
          
          if(selectedInnerData)
            innerlabelCount = selectedInnerData.documents.length
  
          for(let i=0;i<documents.length;i++){
            allLabelCount++;
          }
  
          documents.map((doc, i) => {
            let domain = doc.domain
            let faculty = doc.faculty
  
            allSubjects.push(domain)
            allFacultyName.push(faculty)
          })
        })}
        
        {showDiv && (
          <div id="overlay">
            <button id='closeBtn' onClick={handlehideDiv}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
            <VideoDetails myTitle={myTitle} myVideoFileName={myVideoFileName} showDiv={showDiv}/>
          </div>
        )}
  
        {displayOuterPieChartoverlay && (
          <div id="outerPieChartoverlay">
            <h4 id='innerChartLabel'>Topic: {innerChartLabel}</h4>
            <button id='closeOuterChartBtn' onClick={outerChartCloseBtn}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
            <PieChart width={700} height={500}>
              <Pie
                data={OuterChartData}             //Display Outer PieChart 
                dataKey="count"
                nameKey="title"
                cx={323}
                cy={242}
                labelLine={false}
                isAnimationActive={false}
                animationDuration={0}
                outerRadius={162}
                innerRadius={138}
                fontWeight='bold'
                fontSize='12px'
                label={(entry) => entry.title.toUpperCase()}
                onClick={handleOuterPieEnter}
              >
                {OuterChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={OuterColors[index % OuterColors.length]}
                    stroke={selectedOuterSliceIndex === index ? '#000' : '#fff'}
                    strokeWidth={selectedOuterSliceIndex === index ? 2 : 1}
                    onClick={() => handleOuterSliceClick(index)}
                  />
                ))}
              </Pie>
            </PieChart>    
          </div>
        )}

        <div id="pieChartView">
          <PieChart width={700} height={500}>
            <Pie
              data={myData}                   //Display Inner PieChart 
              dataKey="count"
              nameKey="labels"
              cx={323}
              cy={242}
              labelLine={false}
              isAnimationActive={false}
              animationDuration={0}
              outerRadius={162}
              innerRadius={138}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, index, title, labels }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
                return (
                  <text
                    x={x}
                    y={y}
                    fill={InnerColors[index % InnerColors.length]}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    style={{ fontSize: '12px', fontWeight: 'bold'}}
                  >
                    {labels[0].toUpperCase()}
                  </text>
                );
              }}
              onClick={handleInnerPieEnter}
            >
              {myData.map((entry, index) => (
                <Cell
                key={`cell-${index}`}
                fill={InnerColors[index % InnerColors.length]}
                stroke={selectedInnerSliceIndex === index ? 'black' : 'none'}
                strokeWidth={selectedInnerSliceIndex === index ? 2 : 0}
                onClick={() => handleInnerSliceClick(index)}
              />
              ))}
            </Pie>
          </PieChart>
        </div>
  
        <div className="displayPieChartContent">

          {/* Displaying the label data(India & Bengal) which has been clicked by user in inner piechart*/}
          {showInnerContent && selectedInnerData && (
            <div className="piechart-content">
              

              {myData.map((post) => {
                let { labels, documents } = post

                labels = labels[0]

                if (selectedInnerData.labels[0] === labels) {
                  return documents.map((doc, i) => {
                    let title = doc.title
                    let content = doc.content
                    //let domain = doc.domain
                    //let faculty = doc.faculty
                    //let videoFileName = './rbi/' + doc.video_File_Name + '.mp4'
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

                    if(facultySelected !== '' || subjectSelected !== '')
                      innerlabelCount = count
                    else
                      innerlabelCount = count + 1

                    display = true

                    let filters = addfilter(facultyName, facultySelected, domainName, subjectSelected)

                    if(filters)
                      return (<div key={i}> {displayContent(title,content,transcript,videoFileName)} </div>)
                  })
                }
              })}
              
              {display && (
                <div className="label-count" key={uniqueId}>
                  <h4 id='allResultstext'>All results for {selectedTopic}: {innerlabelCount}</h4>
                  {renderFilterOverlay()}
                </div>
              )}
            </div>
          )}
  
          {/* Displaying the label data(India & Bengal) which has been clicked by user in outer piechart*/}
          {showOuterContent && (
            <div className="piechart-content">
              <div className="label-count" key={uniqueId}>
                <h4 id='allResultstext'>All results for {selectedTopic}: {1}</h4>
              </div>
              {myData.map((post) => {
                let { documents } = post
  
                return documents.map((doc, i) => {
                  let title = doc.title
                  let content = doc.content
                  let domain = doc.domain
                  let faculty = doc.faculty
                  //let videoFileName = './rbi/' + doc.video_File_Name + '.mp4'
                  let videoFileName = './ImgVideoData' + '/video/' + doc.title + '.mp4'
  
                  if (title === selectedOuterData?.title && flag === true) {
                    flag = false

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
  
                    if(filters)
                      return (<div key={i}> {displayContent(title,content,transcript,videoFileName)} </div>)
                  }
                })
              })}
            </div>
          )}
  
          {/* Displaying all the data which exist in clustered file */}
          {showAllInnerContent && (
            <div className="piechart-content">
              {myData.map((post) => {
                let { labels, documents } = post

                labels = labels[0]

                return documents.map((doc, i) => {
                  let title = doc.title
                  let content = doc.content
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

                  allLabelCount = count
                  display = true

                  let filters = addfilter(facultyName, facultySelected, domainName, subjectSelected)

                  if(filters)
                    return (<div key={i}> {displayContent(title,content,transcript,videoFileName)} </div>)
                })
              })}

              {display && (
                <div className="label-count" key={uniqueId}>
                  <h4 id='allResultstext'>All results: {allLabelCount}</h4>
                  {renderFilterOverlay()} 
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Charts