import { useState, useEffect } from "react";
import { api } from "../api/axios";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [activeCity, setActiveCity] = useState<string>("");

  // Fetch weather
  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

        try {
    const res = await api.get(`/weather/current?city=${city}`);

    setWeather(res.data);
    setActiveCity(city);

    await fetchHistory();
    await fetchForecast(city);

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

  const deleteFavorite = async (id: number) => {
    try {
      await api.delete(`/favorites/${id}`);
      await fetchFavorites();
    } catch (err) {
      console.log("Failed to delete favorite", err);
    }
  };

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

  const getWeatherIcon = (desc: string) => {
    const d = desc.toLowerCase();

      if (d.includes("clear")) return "☀️";
      if (d.includes("cloud")) return "☁️";
      if (d.includes("rain")) return "🌧️";
      if (d.includes("storm")) return "⛈️";
      if (d.includes("snow")) return "❄️";

      return "🌤️";
  };

  // Load history on page load
  useEffect(() => {
    fetchHistory();
    fetchFavorites();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto" }}>
      <h1>Weathrly Dashboard</h1>

      {/* Search box */}
      <div>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
        />

        <button onClick={fetchWeather}>
          Search
        </button>
      </div>

      {/* Loading error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Weather display */}
      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Feels like: {weather.feels_like}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>{weather.description}</p>
          <button
            onClick={addFavorite}
            style={{ marginTop: "10px" }}
          >
            Save Favorite ⭐
          </button>
        </div>
      )}

      {/* History section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Search History</h2>

        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <span
                  onClick={() => fetchWeatherFromFavorite(item.city_name)}
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    fontWeight:
                      activeCity === item.city_name ? "bold" : "normal",
                    color:
                      activeCity === item.city_name ? "blue" : "black",
                  }}
                >
                  {item.city_name}
                  {item.country ? ` (${item.country})` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Forecast section */}
        <div style={{ marginTop: "40px" }}>
          <h2>5-Day Forecast</h2>

          {forecast.length === 0 ? (
            <p>No forecast data</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {forecast.map((day, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    {getWeatherIcon(day.description)} {day.date}
                  </div>

                  <div style={{ fontSize: "18px" }}>
                    {day.min.toFixed(1)}°C / {day.max.toFixed(1)}°C
                  </div>

                  <div style={{ color: "#666" }}>
                    {day.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites section */}
        <div style={{ marginTop: "40px" }}>
          <h2>Favorite Cities</h2>

          {favorites.length === 0 ? (
            <p>No favorite cities yet</p>
          ) : (
            <ul>
              {favorites.map((favorite) => (
                <li key={favorite.id}>
                  {/* Click city to reuse */}
                  <span
                    onClick={() => fetchWeatherFromFavorite(favorite.city_name)}
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      fontWeight:
                        activeCity === favorite.city_name ? "bold" : "normal",
                      color:
                        activeCity === favorite.city_name ? "green" : "black",
                    }}
                  >
                    {favorite.city_name}
                    {favorite.country ? ` (${favorite.country})` : ""}
                  </span>

                  {/* Delete button */}
                  <button onClick={() => deleteFavorite(favorite.id)}>
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
  );
}