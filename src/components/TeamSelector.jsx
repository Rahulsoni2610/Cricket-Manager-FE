export default function TeamSelector({ teams, onSelect, className }) {
  return (
    <div className={className}>
      <label htmlFor="team-select" className="block text-sm font-medium mb-1">
        Select Team:
      </label>
      <select
        id="team-select"
        onChange={(e) => onSelect(JSON.parse(e.target.value))}
        className="w-full md:w-64 p-2 border rounded-lg"
      >
        <option value="">-- Select a team --</option>
        {teams.map(team => (
          <option key={team.id} value={JSON.stringify(team)}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}