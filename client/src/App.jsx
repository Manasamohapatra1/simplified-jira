import { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import RegistrationForm from './components/Registration/RegistrationForm';
import Layout from './components/Layout';
import LoginForm from './components/Login/LoginForm';
import LandingPage from './components/Landing Page/LandingPage';


function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await fetch("/api/");
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
      } catch (error) {
          console.error("Error fetching data from the backend:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} /> 
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/landingPage" element={<LandingPage />} />
              </Route>   
          </Routes>
      </Router>
    </>
  )
}

export default App
