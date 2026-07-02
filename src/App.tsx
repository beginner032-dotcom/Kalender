import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import MobileLayout from './components/shared/MobileLayout';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Calendars from './pages/Calendars';
import Agenda from './pages/Agenda';
import Profile from './pages/Profile';
import Account from './pages/Account';
import AddEvent from './pages/AddEvent';
import DetailEvent from './pages/DetailEvent';

export default function App() {
  const { isAuthLoaded, user } = useAppStore();

  if (!isAuthLoaded) {
    return <Splash />;
  }

  return (
    <Router>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-black font-sans text-[#1C1B1F] dark:text-zinc-50 overflow-hidden">
        {/* Simulate a mobile device frame for web view */}
        <div className="w-full h-full max-w-md bg-[#F8F9FA] dark:bg-zinc-950 shadow-2xl relative overflow-hidden flex flex-col xl:rounded-[40px] xl:h-[90vh] xl:border-8 xl:border-zinc-800">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            {/* Protected Routes */}
            <Route path="/" element={user ? <MobileLayout /> : <Navigate to="/login" />}>
              <Route index element={<Home />} />
              <Route path="calendar" element={<Calendars />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            <Route path="/account" element={user ? <Account /> : <Navigate to="/login" />} />
            <Route path="/add-event" element={user ? <AddEvent /> : <Navigate to="/login" />} />
            <Route path="/event/:id" element={user ? <DetailEvent /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
