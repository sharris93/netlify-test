import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';

// Services
import * as authService from '../src/services/authService'; // import the authservice
import * as hootService from './services/hootService';

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [hoots, setHoots] = useState([])

  // Location variables
  const navigate = useNavigate()

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const fetchAllHoots = async () => {
    const allHoots = await hootService.index() // Make the API call, receive the data back from the backend server
    setHoots(allHoots) // Set the data to state
  }

  useEffect(() => {
    if (user) {
      fetchAllHoots()
    }
  }, [user])

  const handleAddHoot = async (formData) => {
    const newHoot = await hootService.create(formData)
    setHoots([newHoot, ...hoots])
    navigate('/hoots')
  }


const handleUpdateHoot = async (hootId, formData) => {
  const updatedHoot = await hootService.update(hootId, formData)
  console.log(updatedHoot)
  navigate(`/hoots/${hootId}`);
};

  const handleDeleteHoot = async (hootId) => {
    // Send the DELETE request via our service function
    const deletedHoot = await hootService.deleteHoot(hootId)
    console.log(deletedHoot)
    // Update state to reflect the up to date hoots list
    await fetchAllHoots()
    // Navigate to hoot index
    navigate('/hoots')
  }

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hoots" element={<HootList hoots={hoots} />} />
              <Route path="/hoots/:hootId" element={<HootDetails handleDeleteHoot={handleDeleteHoot} />} />
              <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
              <Route path="/hoots/:hootId/edit" element={<HootForm handleUpdateHoot={handleUpdateHoot} />} />
            </>
          ) : (
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
