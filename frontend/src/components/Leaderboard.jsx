function Leaderboard({ leaderboard, currentUserId }) {
  return (
    <div className="card bg-neutral shadow-2xl border border-primary/20">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="card-title text-3xl text-primary mb-2 flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              OC Parking Reminder
            </h2>
            <p className="text-base-content/70">See how much everyone has saved on parking</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-base-300">
                <th className="text-base-content/70">Rank</th>
                <th className="text-base-content/70">Name</th>
                <th className="text-base-content/70 text-right">Total Saved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-base-content/50 py-8">
                    No users yet. Be the first!
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-base-300 hover:bg-base-300/20 transition-colors ${user.id === currentUserId ? 'bg-primary/10 border-primary/30' : ''
                      }`}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-base-content">
                          #{index + 1}
                        </span>
                        {index === 0 && <span className="text-2xl">👑</span>}
                        {user.id === currentUserId && (
                          <span className="badge badge-primary badge-sm">You</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-base-content">{user.displayName}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-success font-bold text-lg">
                        RM {user.totalRmSaved.toFixed(0)}
                      </span>
                      <span className="text-base-content/50 text-sm ml-2">saved</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;




