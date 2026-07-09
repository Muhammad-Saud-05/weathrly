import { useState } from "react";

interface Props {
  onSearch: (city: string) => void;
}

export default function WeatherSearch({ onSearch }: Props) {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) return;

    onSearch(city);
    setCity("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 rounded-lg border px-4 py-2"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white"
      >
        Search
      </button>
    </form>
  );
}