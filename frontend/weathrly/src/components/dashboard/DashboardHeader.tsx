interface DashboardHeaderProps {
  username: string;
  email: string;
  onLogout: () => void;
}

export default function DashboardHeader({
  username,
  email,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header>
      <h1>Weather Dashboard</h1>

      <p>
        Welcome, <strong>{username}</strong>
      </p>

      <p>{email}</p>

      <button onClick={onLogout}>Logout</button>
    </header>
  );
}