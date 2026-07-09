interface Props {
  weather: any;
  onFavorite: () => void;
}

export default function CurrentWeather({
  weather,
  onFavorite,
}: Props) {
  if (!weather) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>{weather.city}</h2>

      <p>
        Temperature: {weather.temperature}°C
      </p>

      <p>
        Feels like: {weather.feels_like}°C
      </p>

      <p>
        Humidity: {weather.humidity}%
      </p>

      <p>
        {weather.description}
      </p>

      <button
        onClick={onFavorite}
        style={{ marginTop: "10px" }}
      >
        Save Favorite ⭐
      </button>
    </div>
  );
}