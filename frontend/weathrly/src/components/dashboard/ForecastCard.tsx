interface ForecastCardProps {
  forecast: {
    date: string;
    min: number;
    max: number;
    description: string;
  };
  icon: string;
}

export default function ForecastCard({
  forecast,
  icon,
}: ForecastCardProps) {
  return (
    <div>
      <h3>{forecast.date}</h3>

      <p>{icon}</p>

      <p>
        {forecast.description}
      </p>

      <p>
        Min: {forecast.min}°C
      </p>

      <p>
        Max: {forecast.max}°C
      </p>
    </div>
  );
}