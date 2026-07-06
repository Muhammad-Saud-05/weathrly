import { useState, useEffect } from "react";
import { api } from "../api/axios";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  // Fetch weather
  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

        try {
    const res = await api.get(`/weather/current?city=${city}`);

    setWeather(res.data);

    await fetchHistory();

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

      // refresh list after adding
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

      await fetchHistory();
    } catch (err) {
      console.log(err);
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
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
                {item.city_name}{" "}
                {item.country ? `(${item.country})` : ""}
              </li>
            ))}
          </ul>
        )}

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
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => fetchWeatherFromFavorite(favorite.city_name)}
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