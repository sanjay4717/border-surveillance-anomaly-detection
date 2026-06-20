/**
 * Results panel — shows the outcome of the most recent scan: detection
 * count, anomaly count, and a breakdown list of every object found
 * with its class, confidence, and anomaly status.
 */
export default function ResultsPanel({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="border border-hud-line bg-hud-panel/50 rounded-sm p-5 flex items-center justify-center min-h-[260px]">
        <div className="text-hud-green text-sm tracking-widest animate-blink">
          PROCESSING FRAME...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border border-hud-line bg-hud-panel/50 rounded-sm p-5 flex items-center justify-center min-h-[260px]">
        <div className="text-hud-dim text-sm text-center">
          No scan run yet.
          <br />
          Upload a frame and run a scan to see results here.
        </div>
      </div>
    );
  }

  const hasAnomaly = result.anomaly_count > 0;

  return (
    <div className="border border-hud-line bg-hud-panel/50 rounded-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-600 tracking-wide text-hud-text">
          SCAN RESULT
        </h2>
        <span
          className={`text-xs font-700 tracking-widest px-2 py-0.5 rounded-sm border ${
            hasAnomaly
              ? "border-hud-red text-hud-red shadow-glow-red"
              : "border-hud-green text-hud-green shadow-glow"
          }`}
        >
          {hasAnomaly ? `${result.anomaly_count} ANOMALY` : "CLEAR"}
        </span>
      </div>

      <div className="text-sm text-hud-dim">
        {result.detections.length} object(s) detected in restricted-zone analysis
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {result.detections.length === 0 && (
          <div className="text-hud-dim text-sm italic">No objects detected in frame.</div>
        )}
        {result.detections.map((det, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-3 py-2 rounded-sm border text-sm ${
              det.is_anomaly
                ? "border-hud-red/40 bg-hud-red/5"
                : "border-hud-line bg-hud-black/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  det.is_anomaly ? "bg-hud-red" : "bg-hud-green"
                }`}
              />
              <span className="capitalize text-hud-text">{det.class}</span>
              {det.is_anomaly && (
                <span className="text-hud-red text-xs tracking-wide">[ INTRUSION ]</span>
              )}
            </div>
            <span className="text-hud-dim text-xs">
              {(det.confidence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
