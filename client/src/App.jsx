import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from './Scenes/ProfilePage';
import HomePage from './Scenes/HomePage';
import LoginPage from './Scenes/LoginPage';
import RegisterPage from './Scenes/RegisterPage';
import InAppNavBar from './Components/InAppNavBar';
import NavBar from './Components/NavBar';
import { useEffect, useState } from 'react';

function App() {
  const [localValue, setLocalValue] = useState(() => {
    return localStorage.getItem("userId");
  });

  const [firstName, setFirstName] = useState(() => {
    const localFirstName = localStorage.getItem("firstName");
    return localFirstName;
  });

  const [lastName, setLastName] = useState(() => {
    const localLastName = localStorage.getItem("lastName");
    return localLastName;
  });
  
  const [profile, setProfile] = useState("");

  useEffect(() => {
    setProfile(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return (
    <>
      {localValue ? (<InAppNavBar profile={profile} />) : (<NavBar />)}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
