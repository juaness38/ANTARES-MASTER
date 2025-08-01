import AppRouter from "./routes/AppRouter";
import { useEffect, useState } from "react";
import FullPageLoader from "./components/ui/FullPageLoader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {loading && <FullPageLoader />}
      {!loading && (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
          <AppRouter />
        </div>
      )}
    </>
  );
}

export default App;
