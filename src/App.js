import { useState, useEffect } from 'react';
import logo from './assets/logo_trainerize.png';
import './style.scss';

const BASE_FETCH_URL = "https://api.agify.io/";
const localStorage = window.localStorage;

const App = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // set timeout to reduce redundant API calls
  useEffect(() => {
    const timeOutId = setTimeout(() => handleProfileByName(name), 500);
    return () => clearTimeout(timeOutId);
  }, [name]);

  const handleChangeInput = e => {
    const isValidInput = validateInput(e.target.value);
    if(!isValidInput) {
      setErrorMsg('Numbers or special characters are not accepted');
    } else {
      setErrorMsg("");
      setName(e.target.value);
    }
    // reset profile data if input is empty
    if(e.target.value === "") {
      setProfile({});
    }
  }

  const validateInput = input => {
    return input.match(/[^A-Za-z ]/g) ? false : true;
  }

  // if user enter press, fetching data
  const handleKeyPress = e => {
    if(e.key === 'Enter'){
      console.log('name', name);
      handleProfileByName(name);
    }
  }

  // update data and set it in localStorage
  const handleSetProfileStorage = (newProfile) => {
    const profileData = localStorage.getItem('profile');
    let data = JSON.parse(profileData);
    if(data == null) { data = {} };
    data = { ...data, [newProfile.name]: newProfile };
    localStorage.setItem('profile', JSON.stringify(data));
  }

  // if the name already exists in profile, return data.
  const validateDuplicateName = (name) => {
    const profileData = localStorage.getItem('profile');
    let data = JSON.parse(profileData);
    if(data == null) { return false };
    return data[name];
  }

  // see if there's any duplicate. if not, fetch
  const handleProfileByName = (name) => {
    const profileFromCache = validateDuplicateName(name);
    if(profileFromCache) {
      setProfile(profileFromCache);
    } else {
      handleFetchAgeByName(name);
    }
  }

  // call API
  const handleFetchAgeByName = async (name) => {
    if (!name) { return; }
    setLoading(true);
    try {
      const result = await fetch(`${BASE_FETCH_URL}?name=${name}`);
      if(result.status === 200) {
        const { name, age, count } = await result.json();
        setProfile({ name, age, count });
        handleSetProfileStorage({ name, age, count });
        setLoading(false);
      } else {
        const errMsg = 'Unexpected error occurs';
        throw errMsg;
      }
    } catch (e) {
      setErrorMsg(e);
      setLoading(false);
      console.log('err msg', e);
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <img
          src={logo}
          width="150px"
          height="150px"
          className="logo"
          alt="trainerize-logo"
        />
        <div className="control">
          <label htmlFor="name" className="control__label">Name</label>
          <input
            type="text"
            name="name"
            className="control__input"
            placeholder="Please enter a name to get the estimated age"
            onChange={handleChangeInput}
            value={name}
            onKeyPress={handleKeyPress}
          />
          {errorMsg && <span className="control__error">{errorMsg}</span>}
        </div>
        <hr className="divider" />
        <div className="result-container">
          <div className="result__row">
            <span className="result__label">Estimated age</span>
            <span className="result__value">{profile.age && profile.age}</span>
          </div>
          <div className="result__row">
            <span className="result__label">Count</span>
            <span className="result__value">{profile.count && profile.count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
