/**
 * Alert log — a running table of every scan performed, newest first.
 * Mimics a real surveillance system's event log / incident history.
 */
export default function AlertLog({ history }) {
  return (
    <div className="border border-hud-line bg-hud-panel/50 rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-600 tracking-wide text-hud-text">
          ALERT LOG
        </h2>
        <span className="text-xs text-hud-dim">[ {history.length} ENTRIES ]</span>
      </div>

      {history.length === 0 ? (
        <div className="text-hud-dim text-sm italic py-6 text-center">
          No scans recorded yet. Run a scan to populate the log.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-hud-dim text-xs tracking-widest border-b border-hud-line">
                <th className="text-left py-2 font-normal">TIMESTAMP (UTC)</th>
                <th className="text-left py-2 font-normal">FILE</th>
                <th className="text-left py-2 font-normal">OBJECTS</th>
                <th className="text-left py-2 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-hud-line/50 hover:bg-hud-green/5 transition-colors"
                >
                  <td className="py-2 text-hud-dim">
                    {new Date(entry.timestamp).toLocaleString("en-IN", {
                      hour12: false,
                    })}
                  </td>
                  <td className="py-2 text-hud-text truncate max-w-[160px]">
                    {entry.filename}
                  </td>
                  <td className="py-2 text-hud-text">{entry.total_detections}</td>
                  <td className="py-2">
                    {entry.anomaly_count > 0 ? (
                      <span className="text-hud-red font-600 tracking-wide">
                        ⚠ {entry.anomaly_count} ANOMALY
                      </span>
                    ) : (
                      <span className="text-hud-green tracking-wide">CLEAR</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
