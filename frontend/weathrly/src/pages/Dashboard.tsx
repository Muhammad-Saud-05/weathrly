import { useState, useEffect } from "react";
import { api } from "../api/axios";
import WeatherSearch from "../components/weather/WeatherSearch";
import Forecast from "../components/weather/Forecast";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SearchHistory from "../components/dashboard/SearchHistory";
import FavoriteList from "../components/dashboard/FavoriteList";
import CurrentWeather from "../components/weather/CurrentWeather";

export default function Dashboard() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [activeCity, setActiveCity] = useState<string>("");
  const [user, setUser] = useState<any>(null);


  // Fetch weather
  const fetchWeather = async (searchedCity: string) => {
    if (!searchedCity) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await api.get(`/weather/current?city=${searchedCity}`);

      setWeather(res.data);
      setActiveCity(searchedCity);

      await fetchHistory();
      await fetchForecast(searchedCity);

    } catch (err: any) {
    console.log(err);
    setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  };


  // Fetch history
  const fetchHistory = async () => {
    try {
      const res = await api.get("/history/");
      setHistory(res.data);
    } catch (err) {
      console.log("Failed to fetch history", err);
    }
  };


  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites/");
      setFavorites(res.data);
    } catch (err) {
      console.log("Failed to fetch favorites", err);
    }
  };


  // Add favorites
  const addFavorite = async () => {
  if (!weather) return;

    try {
      await api.post("/favorites/", {
        city_name: weather.city,
        country: weather.country,
      });

      await fetchFavorites();
    } catch (err: any) {
      console.log("Failed to add favorite", err);
      alert(err?.response?.data?.detail || "Could not add favorite");
    }
  };


  // delete favorites
  const deleteFavorite = async (id: number) => {
    try {
      await api.delete(`/favorites/${id}`);
      await fetchFavorites();
    } catch (err) {
      console.log("Failed to delete favorite", err);
    }
  };


  // fetch favorites weather
  const fetchWeatherFromFavorite = async (cityName: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/weather/current?city=${cityName}`);
      setWeather(res.data);
      setActiveCity(cityName);

      await fetchHistory();
      await fetchForecast(cityName);
    } catch (err) {
      console.log(err);
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  };


  // Fetch forecast
  const fetchForecast = async (cityName: string) => {
    try {
      const res = await api.get(`/weather/forecast?city=${cityName}`);

      console.log("RAW FORECAST:", res.data);

      const list = res.data;

      if (!Array.isArray(list)) {
        setForecast([]);
        return;
      }

      const grouped: Record<string, any> = {};

      list.forEach((item: any) => {
        const date = item.datetime.split(" ")[0]; // IMPORTANT FIX

        if (!grouped[date]) {
          grouped[date] = {
            temps: [],
            descriptions: [],
          };
        }

        grouped[date].temps.push(item.temperature);
        grouped[date].descriptions.push(item.description);
      });

      const formatted = Object.keys(grouped).map((date) => {
        const temps = grouped[date].temps;

        return {
          date,
          min: Math.min(...temps),
          max: Math.max(...temps),
          description: grouped[date].descriptions[0],
        };
      });

      console.log("FORMATTED FORECAST:", formatted);

      setForecast(formatted);
    } catch (err) {
      console.log("Failed to fetch forecast", err);
      setForecast([]);
    }
  };

  const clearHistory = async () => {
    try {
      await api.delete("/history/");
      await fetchHistory();
    } catch (err) {
      console.log("Failed to clear history", err);
    }
  };


  const getWeatherIcon = (desc: string) => {
    const d = desc.toLowerCase();

      if (d.includes("clear")) return "☀️";
      if (d.includes("cloud")) return "☁️";
      if (d.includes("rain")) return "🌧️";
      if (d.includes("storm")) return "⛈️";
      if (d.includes("snow")) return "❄️";

      return "🌤️";
  };


  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  // user 
  const fetchUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };


  // Load history on page load
  useEffect(() => {
    fetchHistory();
    fetchFavorites();
    fetchUser();
  }, []);


  
  return (
    <div style={{ maxWidth: "600px", margin: "100px auto" }}>

      <DashboardHeader
        username={user?.username || ""}
        email={user?.email || ""}
        onLogout={handleLogout}
      />

      <WeatherSearch onSearch={fetchWeather} />

      {/* Loading error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <CurrentWeather
        weather={weather}
        onFavorite={addFavorite}
      />

      <SearchHistory
        history={history}
        activeCity={activeCity}
        onSelectCity={fetchWeatherFromFavorite}
        onClearHistory={clearHistory}
      />

      <Forecast
        forecast={forecast}
        getWeatherIcon={getWeatherIcon}
      />

      <FavoriteList
        favorites={favorites}
        activeCity={activeCity}
        onSelectCity={fetchWeatherFromFavorite}
        onDeleteFavorite={deleteFavorite}
      />
    </div>
  );
}