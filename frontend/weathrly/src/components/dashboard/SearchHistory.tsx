interface SearchHistoryProps {
  history: any[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onClearHistory: () => void;
}

export default function SearchHistory({
  history,
  activeCity,
  onSelectCity,
  onClearHistory,
}: SearchHistoryProps) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Search History</h2>

      {history.length === 0 ? (
        <p>No history yet</p>
      ) : (
        <>
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <span
                  onClick={() => onSelectCity(item.city_name)}
                  style={{
                    cursor: "pointer",
                    fontWeight:
                      activeCity === item.city_name ? "bold" : "normal",
                  }}
                >
                  {item.city_name}
                  {item.country ? ` (${item.country})` : ""}
                </span>
              </li>
            ))}
          </ul>

          <button onClick={onClearHistory}>
            Clear Search History
          </button>
        </>
      )}
    </div>
  );
}