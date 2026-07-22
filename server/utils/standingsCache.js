const cachedStandings = {
  overall: null,
  sports: {
    Cricket: null,
    TT: null,
    Badminton: null,
    Chess: null,
    Carrom: null,
    BGMI: null
  }
};

module.exports = {
  getOverallCache: () => cachedStandings.overall,
  setOverallCache: (data) => {
    cachedStandings.overall = data;
  },
  getSportCache: (sport) => cachedStandings.sports[sport],
  setSportCache: (sport, data) => {
    cachedStandings.sports[sport] = data;
  },
  clearCache: () => {
    console.log('Clearing server standings cache...');
    cachedStandings.overall = null;
    Object.keys(cachedStandings.sports).forEach(key => {
      cachedStandings.sports[key] = null;
    });
  }
};
