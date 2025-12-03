import { useState, useEffect } from 'react';

function UserCard({
  user,
  activeSession,
  displayName,
  discordHandle,
  setDiscordHandle,
  onStartParking,
  onRepark,
  onUpdateDiscord
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAfter5PM, setIsAfter5PM] = useState(false);
  const [showDiscordEdit, setShowDiscordEdit] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const klTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
      const currentHour = klTime.getHours();
      const isAfter5 = currentHour >= 17;
      setIsAfter5PM(isAfter5);

      if (activeSession && !isAfter5) {
        const lastReparkTime = new Date(activeSession.lastReparkTime);
        const deadline = new Date(lastReparkTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours
        const remaining = deadline - now;

        console.log('Debug Timer:', {
          now: now.toISOString(),
          lastReparkTime: lastReparkTime.toISOString(),
          deadline: deadline.toISOString(),
          remaining,
          isAfter5
        });

        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds, total: remaining });
        } else {
          setTimeLeft(null);
        }
      } else {
        setTimeLeft(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = (time) => {
    if (!time) return '00:00:00';
    const h = String(time.hours).padStart(2, '0');
    const m = String(time.minutes).padStart(2, '0');
    const s = String(time.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getStatusText = () => {
    if (isAfter5PM) {
      return '🆓 Free parking after 5 PM - No reminders needed!';
    }
    if (!activeSession) {
      return 'No active parking session';
    }
    if (timeLeft) {
      return `⏰ ${formatTime(timeLeft)} left of free parking`;
    }
    return 'Session expired or no active session';
  };

  const getButtonText = () => {
    if (isAfter5PM) {
      return 'Free parking after 5 PM';
    }
    if (!activeSession) {
      return "I'm at the office";
    }
    return "I've reparked my car";
  };

  const handleButtonClick = () => {
    if (isAfter5PM) {
      return;
    }
    if (!activeSession) {
      onStartParking();
    } else {
      onRepark();
    }
  };

  return (
    <div className="card bg-neutral shadow-2xl border border-primary/20">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-2xl text-primary">
            {user?.displayName || displayName}
          </h2>
          {user && (
            <div className="badge badge-primary badge-lg">
              RM {user.totalRmSaved.toFixed(0)} saved
            </div>
          )}
        </div>

        {/* Discord Handle */}
        <div className="mb-4">
          {showDiscordEdit ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="username#1234"
                className="input input-bordered input-sm flex-1"
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  onUpdateDiscord();
                  setShowDiscordEdit(false);
                }}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowDiscordEdit(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base-content/70">Discord:</span>
              <span className="text-base-content">{user?.discordHandle || discordHandle}</span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => setShowDiscordEdit(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="text-lg font-semibold text-base-content mb-2">
            {getStatusText()}
          </div>
          {activeSession && timeLeft && !isAfter5PM && (
            <div className="text-sm text-base-content/70 mt-2">
              💬 Discord reminder will be sent 20 minutes before this ends
            </div>
          )}
          {activeSession && (
            <div className="text-sm text-base-content/50 mt-2">
              Reparked {activeSession.timesReparked} time{activeSession.timesReparked !== 1 ? 's' : ''} today
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          className={`btn btn-lg w-full ${isAfter5PM
              ? 'btn-disabled'
              : activeSession
                ? 'btn-success hover:scale-105 transition-transform'
                : 'btn-primary hover:scale-105 transition-transform'
            }`}
          onClick={handleButtonClick}
          disabled={isAfter5PM}
        >
          {getButtonText()}
        </button>

        {/* Countdown Display */}
        {activeSession && timeLeft && !isAfter5PM && (
          <div className="mt-4 p-4 bg-base-300/30 rounded-lg border border-accent/20">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-accent mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-base-content/70">
                Time remaining until charges apply
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;




