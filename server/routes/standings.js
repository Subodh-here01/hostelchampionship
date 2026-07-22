const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const standingsCache = require('../utils/standingsCache');

// Helper to calculate standings
// Helper to calculate standings for a single sport
function getCalculatedStandingsForSport(sportName, teams, matches) {
  const standingsMap = {};
  teams.forEach(team => {
    const isGroupA = (team.group || 'A') === 'A';
    standingsMap[team._id.toString()] = {
      team: {
        id: team._id,
        name: team.name,
        hostelBlock: team.hostelBlock,
        color: team.color,
        emoji: team.emoji,
        group: isGroupA ? 'A' : 'B',
        nrr: team.nrr || 0
      },
      group: isGroupA ? 'A' : 'B',
      mp: 0,
      w: 0,
      l: 0,
      pts: 0
    };
  });

  const sportMatches = matches.filter(m => m.sport === sportName);

  sportMatches.forEach(match => {
    const teamAId = match.teamA.toString();
    const teamBId = match.teamB.toString();

    if (standingsMap[teamAId]) standingsMap[teamAId].mp += 1;
    if (standingsMap[teamBId]) standingsMap[teamBId].mp += 1;

    if (match.winner) {
      const winnerId = match.winner.toString();
      const loserId = (winnerId === teamAId) ? teamBId : teamAId;

      if (standingsMap[winnerId]) {
        standingsMap[winnerId].w += 1;
        standingsMap[winnerId].pts += 1;
      }
      if (standingsMap[loserId]) {
        standingsMap[loserId].l += 1;
      }
    }
  });

  const standingsArray = Object.values(standingsMap);
  
  // Sort globally first
  standingsArray.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (sportName === 'Cricket' && b.team.nrr !== a.team.nrr) {
      return b.team.nrr - a.team.nrr;
    }
    if (b.w !== a.w) return b.w - a.w;
    return a.mp - b.mp;
  });

  standingsArray.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Calculate ranks *within groups*
  const groupA = standingsArray.filter(item => item.group === 'A').sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (sportName === 'Cricket' && b.team.nrr !== a.team.nrr) {
      return b.team.nrr - a.team.nrr;
    }
    if (b.w !== a.w) return b.w - a.w;
    return a.mp - b.mp;
  });
  const groupB = standingsArray.filter(item => item.group === 'B').sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (sportName === 'Cricket' && b.team.nrr !== a.team.nrr) {
      return b.team.nrr - a.team.nrr;
    }
    if (b.w !== a.w) return b.w - a.w;
    return a.mp - b.mp;
  });

  groupA.forEach((item, index) => {
    item.groupRank = index + 1;
  });
  groupB.forEach((item, index) => {
    item.groupRank = index + 1;
  });

  return standingsArray;
}

// Helper to calculate overall or sport standings
async function getCalculatedStandings(sportFilter = null) {
  // Check cache first
  if (sportFilter) {
    const cached = standingsCache.getSportCache(sportFilter);
    if (cached) return cached;
  } else {
    const cached = standingsCache.getOverallCache();
    if (cached) return cached;
  }

  const teams = await Team.find({});
  const completedMatches = await Match.find({ status: 'Completed' });

  let result;
  if (sportFilter) {
    const sportStandings = getCalculatedStandingsForSport(sportFilter, teams, completedMatches);
    sportStandings.forEach(item => {
      item.breakdown = {
        Cricket: 'none',
        TT: 'none',
        Badminton: 'none',
        Chess: 'none',
        Carrom: 'none',
        BGMI: 'none'
      };
      if (item.mp > 0) {
        item.breakdown[sportFilter] = item.w > item.l ? 'win' : 'loss';
      }
    });
    result = sportStandings;
  } else {
    // Calculate overall standings
    const overallMap = {};
    teams.forEach(team => {
      const isGroupA = (team.group || 'A') === 'A';
      overallMap[team._id.toString()] = {
        team: {
          id: team._id,
          name: team.name,
          hostelBlock: team.hostelBlock,
          color: team.color,
          emoji: team.emoji,
          group: isGroupA ? 'A' : 'B',
          nrr: team.nrr || 0
        },
        group: isGroupA ? 'A' : 'B',
        mp: 0,
        w: 0,
        l: 0,
        pts: 0,
        breakdown: {
          Cricket: 0,
          TT: 0,
          Badminton: 0,
          Chess: 0,
          Carrom: 0,
          BGMI: 0
        },
        breakdownStatus: {
          Cricket: 'none',
          TT: 'none',
          Badminton: 'none',
          Chess: 'none',
          Carrom: 'none',
          BGMI: 'none'
        }
      };
    });

    const sports = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];

    sports.forEach(sport => {
      const sportStandings = getCalculatedStandingsForSport(sport, teams, completedMatches);
      
      sportStandings.forEach(teamStanding => {
        const teamId = teamStanding.team.id.toString();
        const rank = teamStanding.rank;
        
        overallMap[teamId].mp += teamStanding.mp;
        overallMap[teamId].w += teamStanding.w;
        overallMap[teamId].l += teamStanding.l;

        let placementPoints = 0;
        let breakdownStatus = 'none';

        if (sport === 'Cricket') {
          if (rank === 1) { placementPoints = 10; breakdownStatus = 'win'; }
          else if (rank === 2) { placementPoints = 5; breakdownStatus = 'draw'; }
          else if (rank === 3) { placementPoints = 2; breakdownStatus = 'draw'; }
          else if (teamStanding.mp > 0) { breakdownStatus = 'loss'; }
        } else if (sport === 'TT' || sport === 'Badminton' || sport === 'Chess') {
          if (rank === 1) { placementPoints = 6; breakdownStatus = 'win'; }
          else if (rank === 2) { placementPoints = 3; breakdownStatus = 'draw'; }
          else if (rank === 3) { placementPoints = 1; breakdownStatus = 'draw'; }
          else if (teamStanding.mp > 0) { breakdownStatus = 'loss'; }
        } else if (sport === 'Carrom' || sport === 'BGMI') {
          if (rank === 1) { placementPoints = 4; breakdownStatus = 'win'; }
          else if (rank === 2) { placementPoints = 2; breakdownStatus = 'draw'; }
          else if (teamStanding.mp > 0) { breakdownStatus = 'loss'; }
        }

        overallMap[teamId].pts += placementPoints;
        overallMap[teamId].breakdown[sport] = placementPoints;
        overallMap[teamId].breakdownStatus[sport] = breakdownStatus;
      });
    });

    const overallStandings = Object.values(overallMap);
    overallStandings.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.w !== a.w) return b.w - a.w;
      return a.mp - b.mp;
    });

    overallStandings.forEach((item, index) => {
      item.rank = index + 1;
    });

    result = overallStandings;
  }

  // Cache before returning
  if (sportFilter) {
    standingsCache.setSportCache(sportFilter, result);
  } else {
    standingsCache.setOverallCache(result);
  }

  return result;
}

// GET /api/standings - Public (Overall standings)
router.get('/', async (req, res) => {
  try {
    const standings = await getCalculatedStandings();
    return res.status(200).json(standings);
  } catch (error) {
    console.error('Error computing standings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/standings/:sport - Public (Sport-specific standings)
router.get('/:sport', async (req, res) => {
  const sportName = req.params.sport;
  let formattedSport = sportName.charAt(0).toUpperCase() + sportName.slice(1).toLowerCase();
  if (sportName.toUpperCase() === 'TT') formattedSport = 'TT';
  if (sportName.toUpperCase() === 'BGMI') formattedSport = 'BGMI';

  const validSports = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];
  if (!validSports.includes(formattedSport)) {
    return res.status(400).json({ message: `Invalid sport query: ${sportName}` });
  }

  try {
    const standings = await getCalculatedStandings(formattedSport);
    return res.status(200).json(standings);
  } catch (error) {
    console.error('Error computing sport standings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
