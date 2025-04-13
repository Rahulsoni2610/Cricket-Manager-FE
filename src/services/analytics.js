// Mock data - replace with real API calls
export function fetchTeams() {
  return Promise.resolve([
    { id: 1, name: "Mumbai Indians" },
    { id: 2, name: "Chennai Super Kings" },
    // Add more teams
  ]);
}

export function fetchTeamStats(teamId) {
  const mockData = {
    1: {
      totalMatches: 28,
      wins: 18,
      winPercentage: 64,
      highestScore: 218,
      avgScore: 172,
      topPlayer: "Rohit Sharma",
      recentMatches: [
        { opponent: "CSK", score: 185, result: "W" },
        { opponent: "RCB", score: 165, result: "L" },
        { opponent: "KKR", score: 190, result: "W" },
        { opponent: "DC", score: 178, result: "W" },
        { opponent: "SRH", score: 155, result: "L" }
      ]
    },
    2: {
      totalMatches: 38,
      wins: 28,
      winPercentage: 84,
      highestScore: 238,
      avgScore: 142,
      topPlayer: "Virat Kohli",
      recentMatches: [
        { opponent: "CSK", score: 125, result: "W" },
        { opponent: "RCB", score: 165, result: "L" },
        { opponent: "KKR", score: 130, result: "W" },
        { opponent: "DC", score: 118, result: "W" },
        { opponent: "SRH", score: 115, result: "L" }
      ]
    }
  };

  return Promise.resolve(mockData[teamId]);
}





// export function fetchTeamStats(teamId) {
//   return fetch(`/api/teams/${teamId}/stats`)
//     .then(res => res.json());
// }

// {
//   "totalMatches": 28,
//     "wins": 18,
//       "winPercentage": 64,
//         "highestScore": 218,
//           "avgScore": 172,
//             "topPlayer": "Rohit Sharma",
//               "recentMatches": [
//                 {
//                   "opponent": "CSK",
//                   "score": 185,
//                   "result": "W"
//                 }
//               ]
// }