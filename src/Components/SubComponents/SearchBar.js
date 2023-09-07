import React, { useState } from "react"

const SearchBar = (props) => {
  const [searchData, setSearchData] = useState("");

  // Set the data of search input
  const handleChange = (e) => {
    window.scrollTo(0, 0);
    setSearchData(e.target.value);
  };

  // Used to send data to other file using props
  const handleSubmit = (e) => {
    window.scrollTo(0, 0);
    e.preventDefault();

    if(searchData) {
      document.getElementById('searchData').style.width = "13.5rem";
    }
    
    props.onSubmit(searchData);
  };

  return (
    <div className="search-input">
      <form onSubmit={handleSubmit}>
        <input type="text" id="searchData" placeholder="Search for a topic like India" onChange={handleChange} autoComplete="off"/>
        <button type="submit" id="search-btn" className="fa fa-search"></button>
      </form>
    </div>
  )
}

export default SearchBar 