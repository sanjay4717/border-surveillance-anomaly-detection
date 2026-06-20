import { useEffect, useState, useCallback } from "react";
import StatusBar from "./components/StatusBar";
import StatsCards from "./components/StatsCards";
import UploadPanel from "./components/UploadPanel";
import ResultsPanel from "./components/ResultsPanel";
import AlertLog from "./components/AlertLog";
import { detectAnomaly, getHistory, getStats } from "./api/client";

export default function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      const [historyData, statsData] = await Promise.all([getHistory(), getStats()]);
      setHistory(historyData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleAnalyze = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await detectAnomaly(file);
      setResult(data);
      await refreshData();
    } catch (err) {
      console.error(err);
      setError(
        "Could not analyze frame. Make sure the backend server is running and reachable."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scanlines min-h-screen bg-hud-black text-hud-text">
      <StatusBar />

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-700 tracking-wide text-hud-text">
            Border Zone Surveillance Dashboard
          </h1>
          <p className="text-hud-dim text-sm mt-1">
            Upload a surveillance frame to scan for unauthorized presence in
            the restricted boundary zone. Detection powered by YOLOv8.
          </p>
        </div>

        <StatsCards stats={stats} />

        {error && (
          <div className="border border-hud-red/50 bg-hud-red/5 text-hud-red text-sm rounded-sm px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
          <ResultsPanel result={result} isLoading={isLoading} />
        </div>

        <AlertLog history={history} />
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-6 text-center text-hud-dim text-xs">
        SENTRY — Academic demonstration project. Not for operational use.
      </footer>
    </div>
  );
}
