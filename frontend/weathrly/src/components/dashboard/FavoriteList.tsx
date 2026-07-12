interface FavoriteListProps {
  favorites: any[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onDeleteFavorite: (id: number) => void;
}

export default function FavoriteList({
  favorites,
  activeCity,
  onSelectCity,
  onDeleteFavorite,
}: FavoriteListProps) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Favorite Cities</h2>

      {favorites.length === 0 ? (
        <p>No favorite cities yet</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <span
                onClick={() => onSelectCity(favorite.city_name)}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  fontWeight:
                    activeCity === favorite.city_name
                      ? "bold"
                      : "normal",
                  color:
                    activeCity === favorite.city_name
                      ? "green"
                      : "black",
                }}
              >
                {favorite.city_name}
                {favorite.country
                  ? ` (${favorite.country})`
                  : ""}
              </span>

              <button
                onClick={() =>
                  onDeleteFavorite(favorite.id)
                }
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}