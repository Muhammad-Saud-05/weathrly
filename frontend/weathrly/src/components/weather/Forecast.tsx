interface ForecastDay {
  date: string;
  min: number;
  max: number;
  description: string;
}

interface Props {
  forecast: ForecastDay[];
  getWeatherIcon: (description: string) => string;
}

export default function Forecast({ forecast, getWeatherIcon }: Props) {
  return (
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
  );
}