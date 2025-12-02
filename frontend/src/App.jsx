import { useState, useEffect } from 'react';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import UserCard from './components/UserCard';

// Use environment variable in production, fallback to /api for development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [displayName, setDisplayName] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('displayName');
    const savedDiscord = localStorage.getItem('discordHandle');

    if (savedName && savedDiscord) {
      setDisplayName(savedName);
      setDiscordHandle(savedDiscord);
      setIsInitialized(true);
      loadUser(savedName);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load leaderboard
  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Refresh user data periodically
  useEffect(() => {
    if (displayName) {
      const interval = setInterval(() => {
        loadUser(displayName);
      }, 5000); // Refresh every 5s
      return () => clearInterval(interval);
    }
  }, [displayName]);

  const loadLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadUser = async (name) => {
    try {
      const response = await axios.get(`${API_BASE}/me`, {
        params: { displayName: name }
      });
      setUser(response.data.user);
      setActiveSession(response.data.activeSession);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      setIsLoading(false);
    }
  };

  const handleInitialize = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/user`, {
        displayName,
        discordHandle
      });
      localStorage.setItem('displayName', displayName);
      localStorage.setItem('discordHandle', discordHandle);
      setIsInitialized(true);
      await loadUser(displayName);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error initializing user:', error);
      alert('Failed to initialize user. Please try again.');
    }
  };

  const handleStartParking = async () => {
    try {
      const response = await axios.post(`${API_BASE}/parking/start`, {
        displayName
      });
      setActiveSession(response.data.session);
      await loadUser(displayName);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error starting parking:', error);
      alert('Failed to start parking session. Please try again.');
    }
  };

  const handleRepark = async () => {
    try {
      const response = await axios.post(`${API_BASE}/parking/repark`, {
        displayName
      });
      setActiveSession(response.data.session);
      await loadUser(displayName);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error reparking:', error);
      const errorMsg = error.response?.data?.error || 'Failed to repark. Please try again.';
      alert(errorMsg);
    }
  };

  const handleUpdateDiscord = async () => {
    try {
      await axios.post(`${API_BASE}/user`, {
        displayName,
        discordHandle
      });
      await loadUser(displayName);
      alert('Discord handle updated!');
    } catch (error) {
      console.error('Error updating Discord handle:', error);
      alert('Failed to update Discord handle. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-neutral shadow-2xl w-full max-w-md border border-primary/20">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 text-primary">Welcome to Parking Reminder</h2>
            <p className="text-base-content/70 mb-6">Enter your details to get started</p>
            <form onSubmit={handleInitialize}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-base-content">Display Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered input-primary w-full"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text text-base-content">Discord Handle</span>
                </label>
                <input
                  type="text"
                  placeholder="username#1234"
                  className="input input-bordered input-primary w-full"
                  value={discordHandle}
                  onChange={(e) => setDiscordHandle(e.target.value)}
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/50">Format: username#1234</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Leaderboard Section */}
        <Leaderboard leaderboard={leaderboard} currentUserId={user?.id} />

        {/* User Card Section */}
        <UserCard
          user={user}
          activeSession={activeSession}
          displayName={displayName}
          discordHandle={discordHandle}
          setDiscordHandle={setDiscordHandle}
          onStartParking={handleStartParking}
          onRepark={handleRepark}
          onUpdateDiscord={handleUpdateDiscord}
        />
      </div>
    </div>
  );
}

export default App;


