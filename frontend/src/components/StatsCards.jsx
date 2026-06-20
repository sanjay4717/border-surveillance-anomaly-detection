/**
 * Three key metrics displayed as HUD-style readout cards at the top of
 * the dashboard: total scans run, total objects detected, and total
 * anomalies flagged. Gives an at-a-glance system summary.
 */
export default function StatsCards({ stats }) {
  const cards = [
    { label: "TOTAL SCANS", value: stats?.total_scans ?? 0, color: "text-hud-blue" },
    { label: "OBJECTS DETECTED", value: stats?.total_detections ?? 0, color: "text-hud-green" },
    { label: "ANOMALIES FLAGGED", value: stats?.total_anomalies ?? 0, color: "text-hud-amber" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border border-hud-line bg-hud-panel/50 rounded-sm px-5 py-4"
        >
          <div className="text-xs text-hud-dim tracking-widest mb-1">{card.label}</div>
          <div className={`font-display text-3xl font-700 ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
