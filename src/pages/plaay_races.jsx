import React, { useState, useMemo } from 'react';

// All 32 Jockeys
const JOCKEYS = [
  { id: 1, name: 'Mero Abreu', skill: 7, ask: 4, dq: 6 },
  { id: 2, name: 'JP Barajas', skill: 7, ask: 5, dq: 3 },
  { id: 3, name: 'Mo Caldera', skill: 6, ask: 5, dq: 5 },
  { id: 4, name: 'Riviera Cano', skill: 7, ask: 5, dq: 5 },
  { id: 5, name: 'Fansler Darst', skill: 8, ask: 5, dq: 6 },
  { id: 6, name: 'Hucks Davis', skill: 7, ask: 3, dq: 9 },
  { id: 7, name: 'McRainey Dowe', skill: 9, ask: 4, dq: 7 },
  { id: 8, name: 'Dawe Emmer', skill: 9, ask: 4, dq: 3 },
  { id: 9, name: 'Yggy Escobar', skill: 6, ask: 3, dq: 6 },
  { id: 10, name: 'Tru Fiorillo', skill: 9, ask: 4, dq: 4 },
  { id: 11, name: 'Winkles Galgano', skill: 9, ask: 4, dq: 3 },
  { id: 12, name: 'Robbie Gil', skill: 8, ask: 5, dq: 3 },
  { id: 13, name: 'Stookey Green', skill: 6, ask: 4, dq: 3 },
  { id: 14, name: 'Greg Haar', skill: 5, ask: 4, dq: 2 },
  { id: 15, name: 'Cullen Jauregui', skill: 7, ask: 3, dq: 4 },
  { id: 16, name: 'Jamaal King', skill: 5, ask: 4, dq: 2 },
  { id: 17, name: 'Vaught Legler', skill: 8, ask: 3, dq: 7 },
  { id: 18, name: 'Olesen Manseau', skill: 5, ask: 4, dq: 5 },
  { id: 19, name: 'Fegan Mercado', skill: 10, ask: 5, dq: 3 },
  { id: 20, name: 'Danny Minjares', skill: 7, ask: 5, dq: 4 },
  { id: 21, name: 'Blecha Pellot', skill: 7, ask: 5, dq: 5 },
  { id: 22, name: 'Lee Porras', skill: 7, ask: 4, dq: 4 },
  { id: 23, name: 'Chris Restrepo', skill: 4, ask: 3, dq: 5 },
  { id: 24, name: 'Bryden Riche', skill: 3, ask: 4, dq: 5 },
  { id: 25, name: 'Emerson Risk', skill: 10, ask: 5, dq: 2 },
  { id: 26, name: 'Roscoe Rodarte', skill: 6, ask: 4, dq: 3 },
  { id: 27, name: 'Gee Sakamoto', skill: 6, ask: 4, dq: 4 },
  { id: 28, name: 'Bailey Schober', skill: 8, ask: 3, dq: 8 },
  { id: 29, name: 'Hogan Soucie', skill: 10, ask: 4, dq: 4 },
  { id: 30, name: 'Tomm Spadaforra', skill: 6, ask: 4, dq: 4 },
  { id: 31, name: 'Javier Uinta', skill: 7, ask: 4, dq: 5 },
  { id: 32, name: 'Eriberto Vita', skill: 8, ask: 4, dq: 2 },
];

// All 96 Horses from Excel
const ALL_HORSES = [
  { id: 1, name: 'Millionaire Janitor', betRating: 1, trophy: 'gold', profile: 'front runner' },
  { id: 2, name: 'Blue Planet', betRating: 2, trophy: 'silver', profile: 'front runner' },
  { id: 3, name: 'Runs Like a Drunk', betRating: 3, trophy: 'bronze', profile: 'closer' },
  { id: 4, name: 'Second Fiddle', betRating: 4, trophy: 'silver', profile: 'stalker' },
  { id: 5, name: 'Girl Next Door', betRating: 5, trophy: 'gold', profile: 'front runner' },
  { id: 6, name: 'Left-Handed Compliment', betRating: 6, trophy: 'bronze', profile: 'closer' },
  { id: 7, name: 'YOLO Believer', betRating: 7, trophy: 'bronze', profile: 'middler' },
  { id: 8, name: "Don't Look Now", betRating: 8, trophy: 'silver', profile: 'stalker' },
  { id: 9, name: 'Equine Wonder', betRating: 9, trophy: 'silver', profile: 'stalker' },
  { id: 10, name: 'Six For A Dollar', betRating: 10, trophy: 'gold', profile: 'front runner' },
  { id: 11, name: 'Uncle Billy', betRating: 11, trophy: 'bronze', profile: 'middler' },
  { id: 12, name: "That's What Mom Said", betRating: 12, trophy: 'bronze', profile: 'closer' },
  { id: 13, name: 'Gotta Go Now', betRating: 13, trophy: 'bronze', profile: 'closer' },
  { id: 14, name: 'Never Mind', betRating: 14, trophy: 'gold', profile: 'front runner' },
  { id: 15, name: 'Nicanor', betRating: 15, trophy: 'silver', profile: 'stalker' },
  { id: 16, name: "Rockin' Mozart", betRating: 16, trophy: 'silver', profile: 'stalker' },
  { id: 17, name: "Swig O' Whiskey", betRating: 17, trophy: 'silver', profile: 'stalker' },
  { id: 18, name: 'Left It On The Table', betRating: 18, trophy: 'bronze', profile: 'closer' },
  { id: 19, name: 'Banana Republic', betRating: 19, trophy: 'bronze', profile: 'middler' },
  { id: 20, name: 'Greenhouse Effect', betRating: 20, trophy: 'silver', profile: 'front runner' },
  { id: 21, name: 'Zippi Longstocking', betRating: 21, trophy: 'bronze', profile: 'middler' },
  { id: 22, name: 'Star in the Making', betRating: 22, trophy: 'gold', profile: 'front runner' },
  { id: 23, name: 'Bolt Of Lightning', betRating: 23, trophy: 'bronze', profile: 'closer' },
  { id: 24, name: 'Bee by the Sea', betRating: 24, trophy: 'gold', profile: 'front runner' },
  { id: 25, name: 'Ask Your Doctor', betRating: 25, trophy: 'bronze', profile: 'closer' },
  { id: 26, name: "Ragin' Cajun", betRating: 26, trophy: 'silver', profile: 'stalker' },
  { id: 27, name: 'Contentious Kal', betRating: 27, trophy: 'bronze', profile: 'closer' },
  { id: 28, name: 'Pillow Talk', betRating: 28, trophy: 'bronze', profile: 'middler' },
  { id: 29, name: 'Rain Dance', betRating: 29, trophy: 'gold', profile: 'front runner' },
  { id: 30, name: 'Controlled Chaos', betRating: 30, trophy: 'bronze', profile: 'middler' },
  { id: 31, name: 'Befuddled And Broke', betRating: 31, trophy: 'bronze', profile: 'closer' },
  { id: 32, name: 'Mister Z', betRating: 32, trophy: 'silver', profile: 'stalker' },
  { id: 33, name: 'Vee Eight', betRating: 33, trophy: 'silver', profile: 'stalker' },
  { id: 34, name: 'Gift Of Grab', betRating: 34, trophy: 'silver', profile: 'stalker' },
  { id: 35, name: 'Wait What?', betRating: 35, trophy: 'bronze', profile: 'closer' },
  { id: 36, name: 'N Between', betRating: 36, trophy: 'silver', profile: 'stalker' },
  { id: 37, name: 'Petunia Queen', betRating: 37, trophy: 'bronze', profile: 'middler' },
  { id: 38, name: 'Perfect Ten', betRating: 38, trophy: 'bronze', profile: 'closer' },
  { id: 39, name: 'Buddy Wuzz', betRating: 39, trophy: 'gold', profile: 'front runner' },
  { id: 40, name: 'One for Forty', betRating: 40, trophy: 'bronze', profile: 'middler' },
  { id: 41, name: 'Rigoberto', betRating: 41, trophy: 'gold', profile: 'front runner' },
  { id: 42, name: 'In Your Dreams', betRating: 42, trophy: 'bronze', profile: 'middler' },
  { id: 43, name: 'Hoya Palloya', betRating: 43, trophy: 'gold', profile: 'front runner' },
  { id: 44, name: 'Grey Mist', betRating: 44, trophy: 'bronze', profile: 'middler' },
  { id: 45, name: 'My Friend Fred', betRating: 45, trophy: 'bronze', profile: 'middler' },
  { id: 46, name: 'Rinkee Dinkee', betRating: 46, trophy: 'bronze', profile: 'middler' },
  { id: 47, name: 'Notorious BID', betRating: 47, trophy: 'gold', profile: 'front runner' },
  { id: 48, name: 'Tally Ho', betRating: 48, trophy: 'bronze', profile: 'middler' },
  { id: 49, name: 'Sharpshooter', betRating: 49, trophy: 'bronze', profile: 'closer' },
  { id: 50, name: 'Striped Lines', betRating: 50, trophy: 'bronze', profile: 'middler' },
  { id: 51, name: "Erma's Joy", betRating: 51, trophy: 'bronze', profile: 'closer' },
  { id: 52, name: 'Lump of Coal', betRating: 52, trophy: 'gold', profile: 'front runner' },
  { id: 53, name: 'Sam Sneezed', betRating: 53, trophy: 'silver', profile: 'front runner' },
  { id: 54, name: 'Fabulous Fran', betRating: 54, trophy: 'gold', profile: 'front runner' },
  { id: 55, name: 'Midnight Star', betRating: 55, trophy: 'silver', profile: 'stalker' },
  { id: 56, name: 'Golden Roamer', betRating: 56, trophy: 'silver', profile: 'stalker' },
  { id: 57, name: 'Recycle Me', betRating: 57, trophy: 'silver', profile: 'stalker' },
  { id: 58, name: 'Quicken', betRating: 58, trophy: 'bronze', profile: 'closer' },
  { id: 59, name: 'What Me Worry?', betRating: 59, trophy: 'bronze', profile: 'middler' },
  { id: 60, name: 'Stack the Deck', betRating: 60, trophy: 'gold', profile: 'front runner' },
  { id: 61, name: 'Gave at the Office', betRating: 61, trophy: 'silver', profile: 'stalker' },
  { id: 62, name: 'Shut Yer Pie Hole', betRating: 62, trophy: 'bronze', profile: 'middler' },
  { id: 63, name: 'Mind Heart and Soul', betRating: 63, trophy: 'silver', profile: 'stalker' },
  { id: 64, name: 'Fun with Bubbles', betRating: 64, trophy: 'bronze', profile: 'middler' },
  { id: 65, name: 'LMNOP', betRating: 65, trophy: 'silver', profile: 'stalker' },
  { id: 66, name: 'Paging Jerry Cuan', betRating: 66, trophy: 'silver', profile: 'stalker' },
  { id: 67, name: 'Y Tanaka', betRating: 67, trophy: 'bronze', profile: 'middler' },
  { id: 68, name: 'Silver Lining', betRating: 68, trophy: 'silver', profile: 'stalker' },
  { id: 69, name: 'Mike Drop', betRating: 69, trophy: 'bronze', profile: 'middler' },
  { id: 70, name: 'Eubeedubee', betRating: 70, trophy: 'bronze', profile: 'middler' },
  { id: 71, name: 'Big Red FFF', betRating: 71, trophy: 'bronze', profile: 'closer' },
  { id: 72, name: 'Synchronic', betRating: 72, trophy: 'silver', profile: 'stalker' },
  { id: 73, name: 'Yes to Everything', betRating: 73, trophy: 'bronze', profile: 'closer' },
  { id: 74, name: 'Insta-Plod', betRating: 74, trophy: 'bronze', profile: 'middler' },
  { id: 75, name: 'King Elmo', betRating: 75, trophy: 'gold', profile: 'front runner' },
  { id: 76, name: 'Remembering Remy', betRating: 76, trophy: 'bronze', profile: 'middler' },
  { id: 77, name: 'Doctor Bevans', betRating: 77, trophy: 'bronze', profile: 'middler' },
  { id: 78, name: 'Gracelessly Great', betRating: 78, trophy: 'bronze', profile: 'middler' },
  { id: 79, name: 'Her Royal Highness', betRating: 79, trophy: 'bronze', profile: 'middler' },
  { id: 80, name: 'Surfboard Charlie', betRating: 80, trophy: 'silver', profile: 'stalker' },
  { id: 81, name: 'In the Pink', betRating: 81, trophy: 'bronze', profile: 'middler' },
  { id: 82, name: 'Repetez-Vous', betRating: 82, trophy: 'bronze', profile: 'middler' },
  { id: 83, name: "John Elway's Horse", betRating: 83, trophy: 'bronze', profile: 'closer' },
  { id: 84, name: 'Holier Than Thou', betRating: 84, trophy: 'bronze', profile: 'middler' },
  { id: 85, name: 'Flamingo Pass', betRating: 85, trophy: 'bronze', profile: 'middler' },
  { id: 86, name: 'Arizona Kidd', betRating: 86, trophy: 'bronze', profile: 'middler' },
  { id: 87, name: 'Checkie Check Check', betRating: 87, trophy: 'bronze', profile: 'middler' },
  { id: 88, name: 'Detention Genius', betRating: 88, trophy: 'bronze', profile: 'middler' },
  { id: 89, name: 'Soap Sud', betRating: 89, trophy: 'bronze', profile: 'middler' },
  { id: 90, name: 'Queen Vashti', betRating: 90, trophy: 'bronze', profile: 'middler' },
  { id: 91, name: 'Candle in the Wind', betRating: 91, trophy: 'bronze', profile: 'closer' },
  { id: 92, name: 'Fool Injector', betRating: 92, trophy: 'bronze', profile: 'middler' },
  { id: 93, name: 'Horse With No Name', betRating: 93, trophy: 'bronze', profile: 'middler' },
  { id: 94, name: 'Outta Nowhere', betRating: 94, trophy: 'bronze', profile: 'middler' },
  { id: 95, name: 'Mona Loosa', betRating: 95, trophy: 'bronze', profile: 'closer' },
  { id: 96, name: 'Slow Boat To China', betRating: 96, trophy: 'bronze', profile: 'middler' },
];

// Betting Odds Table
const calculateOdds = (horseAtGate) => {
  const oddsTable = {
    1: ['1-2', '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1', '11-1', '12-1', '14-1', '20-1'],
    '2-3': {
      gold: ['2-1', '3-1', '4-1', '5-1', '6-1', '8-1', '10-1', '12-1', '14-1', '16-1', '18-1', '20-1', '25-1', '30-1'],
      silver: ['3-1', '4-1', '5-1', '6-1', '7-1', '9-1', '11-1', '13-1', '15-1', '17-1', '20-1', '22-1', '30-1', '35-1'],
      bronze: ['4-1', '5-1', '6-1', '7-1', '8-1', '10-1', '12-1', '14-1', '16-1', '18-1', '22-1', '24-1', '35-1', '40-1'],
    },
    '4-6': {
      gold: ['3-1', '4-1', '5-1', '6-1', '7-1', '9-1', '11-1', '13-1', '15-1', '17-1', '20-1', '22-1', '30-1', '35-1'],
      silver: ['4-1', '5-1', '6-1', '7-1', '8-1', '10-1', '12-1', '14-1', '16-1', '18-1', '22-1', '24-1', '35-1', '40-1'],
      bronze: ['5-1', '6-1', '7-1', '8-1', '9-1', '11-1', '13-1', '15-1', '17-1', '19-1', '24-1', '25-1', '40-1', '45-1'],
    },
    '7+': {
      gold: ['4-1', '5-1', '6-1', '7-1', '8-1', '10-1', '12-1', '14-1', '16-1', '18-1', '20-1', '22-1', '24-1', '30-1'],
      silver: ['5-1', '6-1', '7-1', '8-1', '9-1', '11-1', '13-1', '15-1', '18-1', '19-1', '24-1', '25-1', '40-1', '50-1'],
      bronze: ['6-1', '7-1', '8-1', '9-1', '10-1', '12-1', '14-1', '17-1', '20-1', '20-1', '25-1', '30-1', '50-1', '100-1'],
    },
  };

  let gateKey;
  if (horseAtGate.gatePosition === 1) gateKey = 1;
  else if ([2, 3].includes(horseAtGate.gatePosition)) gateKey = '2-3';
  else if ([4, 5, 6].includes(horseAtGate.gatePosition)) gateKey = '4-6';
  else gateKey = '7+';

  const betRank = horseAtGate.betRank;
  if (betRank === undefined) return 'N/A';

  if (gateKey === 1) {
    return oddsTable[1][Math.min(betRank, 13)];
  }
  
  const trophyOdds = oddsTable[gateKey][horseAtGate.trophy];
  return trophyOdds[Math.min(betRank, 13)];
};

export default function App() {
  const [setup, setSetup] = useState({ fieldSize: 9, furlongs: 8, conditions: 'NORMAL', racetrack: '', raceNumber: '' });
  const [gateAssignments, setGateAssignments] = useState(Array(16).fill(null).map(() => ({ jockeyId: '', horseId: '' })));
  const [raceStarted, setRaceStarted] = useState(false);
  const [positions, setPositions] = useState({});
  const [positionHistory, setPositionHistory] = useState({});
  const [currentFurlong, setCurrentFurlong] = useState(1);
  const [raceComplete, setRaceComplete] = useState(false);
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [furlongStartPositions, setFurlongStartPositions] = useState({});

  // Get available horses (not yet selected)
  const getAvailableHorses = (currentGateIdx) => {
    const selectedHorseIds = gateAssignments
      .map((assign, idx) => idx !== currentGateIdx ? assign.horseId : null)
      .filter(Boolean)
      .map(id => parseInt(id));
    
    return ALL_HORSES.filter(h => !selectedHorseIds.includes(h.id));
  };

  // Get available jockeys (not yet selected)
  const getAvailableJockeys = (currentGateIdx) => {
    const selectedJockeyIds = gateAssignments
      .map((assign, idx) => idx !== currentGateIdx ? assign.jockeyId : null)
      .filter(Boolean)
      .map(id => parseInt(id));
    
    return JOCKEYS.filter(j => !selectedJockeyIds.includes(j.id));
  };

  // Get selected race entries
  const selectedRace = useMemo(() => {
    return gateAssignments.slice(0, setup.fieldSize)
      .map((assign, idx) => {
        if (!assign.jockeyId || !assign.horseId) return null;
        const jockey = JOCKEYS.find(j => j.id === parseInt(assign.jockeyId));
        const horse = ALL_HORSES.find(h => h.id === parseInt(assign.horseId));
        return {
          gatePosition: idx + 1,
          horse,
          jockey,
        };
      })
      .filter(Boolean);
  }, [gateAssignments, setup.fieldSize]);

  // Calculate odds - rank by LOWEST BET rating first (better horse)
  const betRankings = useMemo(() => {
    return [...selectedRace]
      .sort((a, b) => a.horse.betRating - b.horse.betRating)
      .map((r, idx) => ({
        ...r,
        betRank: idx,
        gatePosition: r.gatePosition,
        trophy: r.gatePosition === 1 ? 'gold' : r.horse.trophy,
      }));
  }, [selectedRace]);

  const oddsChart = useMemo(() => {
    return betRankings.map(h => ({
      ...h,
      odds: calculateOdds(h),
    }));
  }, [betRankings]);

  const handleGateChange = (idx, field, value) => {
    const newAssignments = [...gateAssignments];
    newAssignments[idx] = { ...newAssignments[idx], [field]: value };
    setGateAssignments(newAssignments);
  };

  const handleStartRace = () => {
    const initialPositions = {};
    selectedRace.forEach((entry) => {
      initialPositions[entry.horse.id] = entry.gatePosition;
    });
    setPositions(initialPositions);
    setFurlongStartPositions({ ...initialPositions });
    setRaceStarted(true);
    setCurrentFurlong(1);
    setSelectedHorseId(null);
  };



  const handleNextFurlong = () => {
    // Capture position at specific furlong milestones (2, 4, 6, 8, 10, 12)
    const keyFurlongs = [2, 4, 6, 8, 10, 12];
    if (keyFurlongs.includes(currentFurlong)) {
      setPositionHistory(prev => ({
        ...prev,
        [currentFurlong]: { ...positions }
      }));
    }
    
    setFurlongStartPositions({ ...positions });
    setSelectedHorseId(null);
    if (currentFurlong < setup.furlongs) {
      setCurrentFurlong(currentFurlong + 1);
    } else {
      setRaceComplete(true);
    }
  };

  const getFinalResults = () => {
    const results = selectedRace.map(entry => ({
      ...entry,
      finalPosition: positions[entry.horse.id] || entry.gatePosition,
    }));
    return results.sort((a, b) => a.finalPosition - b.finalPosition);
  };

  if (raceComplete) {
    const results = getFinalResults();
    
    // Parse odds to get payout multiplier
    const parseOdds = (oddsStr) => {
      if (!oddsStr || oddsStr === 'N/A') return 0;
      const [num] = oddsStr.split('-');
      return parseFloat(num);
    };

    // Calculate WPS payouts
    const calculatePayouts = (oddsStr) => {
      const multiplier = parseOdds(oddsStr);
      if (multiplier === 0) return { win: 0, place: 0, show: 0 };
      const winPayout = 2 * (multiplier + 1);
      return {
        win: winPayout.toFixed(2),
        place: (winPayout * 0.55).toFixed(2),
        show: (winPayout * 0.35).toFixed(2),
      };
    };

    // Calculate Exacta payouts
    const calculateExactaPayouts = (odds1Str, odds2Str) => {
      const odds1 = parseOdds(odds1Str);
      const odds2 = parseOdds(odds2Str);
      if (odds1 === 0 || odds2 === 0) return { $1: 0, $2: 0 };
      const base = odds1 + odds2;
      return {
        $1: (base * 1).toFixed(2),
        $2: (base * 2).toFixed(2),
      };
    };

    // Calculate Trifecta payouts
    const calculateTrifectaPayouts = (odds1Str, odds2Str, odds3Str) => {
      const odds1 = parseOdds(odds1Str);
      const odds2 = parseOdds(odds2Str);
      const odds3 = parseOdds(odds3Str);
      if (odds1 === 0 || odds2 === 0 || odds3 === 0) return { $1: 0, $2: 0 };
      const base = odds1 + odds2 + odds3;
      return {
        $1: (base * 1).toFixed(2),
        $2: (base * 2).toFixed(2),
      };
    };

    // Calculate total WPS pool (simplified)
    const totalWPSPool = (results.length * 2 * 6).toFixed(2); // $2 × 6 bets per horse (conservative estimate)

    // Get column headers for furlong positions with proper distance labels
    const furlongToDistance = (furlong) => {
      if (furlong === setup.furlongs - 1) return 'Str';
      
      const miles = Math.floor(furlong / 8);
      const eighthRemainder = furlong % 8;
      
      // Format the distance label
      let label = '';
      if (miles > 0) label = miles.toString();
      
      if (eighthRemainder === 0) {
        return miles === 0 ? '0' : miles.toString();
      } else if (eighthRemainder === 2) {
        return label ? `${label} 1/4` : '1/4';
      } else if (eighthRemainder === 4) {
        return label ? `${label} 1/2` : '1/2';
      } else if (eighthRemainder === 6) {
        return label ? `${label} 3/4` : '3/4';
      }
      return furlong.toString();
    };

    const keyFurlongs = [2, 4, 6, 8, 10, 12].filter(f => f < setup.furlongs);
    const furlongHeaders = keyFurlongs.map(f => furlongToDistance(f));

    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#fffbf0', border: '4px solid #78350f', borderRadius: '8px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#78350f', marginBottom: '4px' }}>RACE RESULTS</h1>
                {(setup.racetrack || setup.raceNumber) && (
                  <p style={{ fontSize: '16px', color: '#b45309', fontWeight: 600 }}>
                    {setup.racetrack && `${setup.racetrack}`}
                    {setup.racetrack && setup.raceNumber && ' - '}
                    {setup.raceNumber && `Race ${setup.raceNumber}`}
                  </p>
                )}
              </div>
              <div style={{ fontSize: '14px', color: '#b45309', fontWeight: 600 }}>
                <p>{setup.furlongs} Furlongs • {setup.conditions} Track</p>
                <p>Total WPS Pool: ${totalWPSPool}</p>
              </div>
            </div>
            
            {/* Result Chart */}
            <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '3px solid #78350f', backgroundColor: '#fef3c7' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 900, color: '#78350f' }}>Fin</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 900, color: '#78350f' }}>Horse</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 900, color: '#78350f' }}>PP</th>
                    {furlongHeaders.map(header => (
                      <th key={header} style={{ textAlign: 'center', padding: '12px', fontWeight: 900, color: '#78350f', fontSize: '11px' }}>{header}</th>
                    ))}
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 900, color: '#78350f' }}>Str</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 900, color: '#78350f' }}>Fin</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 900, color: '#78350f' }}>Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => {
                    const lastKeyFurlong = keyFurlongs[keyFurlongs.length - 1];
                    const strPosition = lastKeyFurlong ? (positionHistory[lastKeyFurlong] && positionHistory[lastKeyFurlong][r.horse.id]) : '-';
                    return (
                      <tr key={r.horse.id} style={{ backgroundColor: idx % 2 === 0 ? '#fef3c7' : '#ffffff', borderBottom: '1px solid #d4a574' }}>
                        <td style={{ padding: '10px', fontWeight: 900, fontSize: '14px', color: '#78350f' }}>{idx + 1}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#78350f' }}>{r.horse.name}</td>
                        <td style={{ textAlign: 'center', padding: '10px', color: '#78350f' }}>{r.gatePosition}</td>
                        {keyFurlongs.map(furlong => (
                          <td key={furlong} style={{ textAlign: 'center', padding: '10px', color: '#78350f' }}>
                            {positionHistory[furlong] && positionHistory[furlong][r.horse.id] ? positionHistory[furlong][r.horse.id] : '-'}
                          </td>
                        ))}
                        <td style={{ textAlign: 'center', padding: '10px', color: '#78350f' }}>{strPosition}</td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>{r.finalPosition}</td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                          {oddsChart.find(o => o.horse.id === r.horse.id)?.odds}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* WPS Payouts */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
              <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '16px', marginBottom: '16px' }}>$2 WPS PAYOFFS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #78350f' }}>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 900, color: '#78350f' }}>Horse</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>Fin</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>Odds</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>Win</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>Place</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>Show</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 3).map((r, idx) => {
                    const odds = oddsChart.find(o => o.horse.id === r.horse.id)?.odds;
                    const payouts = calculatePayouts(odds);
                    const finishPosition = idx + 1;
                    
                    return (
                      <tr key={r.horse.id} style={{ backgroundColor: idx % 2 === 0 ? '#fef3c7' : '#ffffff', borderBottom: '1px solid #d4a574' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#78350f' }}>{r.horse.name}</td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>{finishPosition}</td>
                        <td style={{ textAlign: 'center', padding: '10px', color: '#78350f' }}>{odds}</td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                          {finishPosition === 1 ? `$${payouts.win}` : '---'}
                        </td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                          {finishPosition <= 2 ? `$${payouts.place}` : '---'}
                        </td>
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>${payouts.show}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Exacta Payouts */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
              <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '16px', marginBottom: '16px' }}>EXACTA PAYOFFS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #78350f' }}>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 900, color: '#78350f' }}>Combination</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>$1</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>$2</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length >= 2 && (
                    <tr style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #d4a574' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        {results[0].horse.name} - {results[1].horse.name}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        ${calculateExactaPayouts(
                          oddsChart.find(o => o.horse.id === results[0].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[1].horse.id)?.odds
                        ).$1}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        ${calculateExactaPayouts(
                          oddsChart.find(o => o.horse.id === results[0].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[1].horse.id)?.odds
                        ).$2}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Trifecta Payouts */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
              <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '16px', marginBottom: '16px' }}>TRIFECTA PAYOFFS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #78350f' }}>
                    <th style={{ textAlign: 'left', padding: '10px', fontWeight: 900, color: '#78350f' }}>Combination</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>$1</th>
                    <th style={{ textAlign: 'center', padding: '10px', fontWeight: 900, color: '#78350f' }}>$2</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length >= 3 && (
                    <tr style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #d4a574' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        {results[0].horse.name} - {results[1].horse.name} - {results[2].horse.name}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        ${calculateTrifectaPayouts(
                          oddsChart.find(o => o.horse.id === results[0].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[1].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[2].horse.id)?.odds
                        ).$1}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold', color: '#78350f' }}>
                        ${calculateTrifectaPayouts(
                          oddsChart.find(o => o.horse.id === results[0].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[1].horse.id)?.odds,
                          oddsChart.find(o => o.horse.id === results[2].horse.id)?.odds
                        ).$2}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => {
                setRaceStarted(false);
                setRaceComplete(false);
                setGateAssignments(Array(16).fill(null).map(() => ({ jockeyId: '', horseId: '' })));
                setPositions({});
                setPositionHistory({});
                setCurrentFurlong(1);
                setSelectedHorseId(null);
                setFurlongStartPositions({});
              }}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                backgroundColor: '#78350f',
                color: '#fffbf0',
                fontWeight: 'bold',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a2d0c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#78350f'}
            >
              Start New Race
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (raceStarted) {
    const handleHorseClick = (horseId) => {
      if (selectedHorseId === null) {
        setSelectedHorseId(horseId);
      } else if (selectedHorseId === horseId) {
        setSelectedHorseId(null);
      } else {
        const pos1 = positions[selectedHorseId];
        const pos2 = positions[horseId];
        setPositions(prev => ({
          ...prev,
          [selectedHorseId]: pos2,
          [horseId]: pos1,
        }));
        setSelectedHorseId(null);
      }
    };

    const getGroupName = (position) => {
      if (position === 1) return 'LEADER';
      if (position <= 3) return 'FRONT';
      if (position <= 6) return 'MIDDLE';
      if (position <= 9) return 'BACK';
      return 'FAR_BACK';
    };

    const getGroupHeader = (groupName) => {
      const headers = {
        'LEADER': 'LEADER (#1)',
        'FRONT': 'FRONT of the Pack (#2 and #3)',
        'MIDDLE': 'MIDDLE of the Pack (#4, #5, and #6)',
        'BACK': 'BACK of the Pack (#7, #8, and #9)',
        'FAR_BACK': 'FAR BACK of the Pack (#10, #11, and #12)',
      };
      return headers[groupName] || '';
    };

    const hasHorseMoved = (horseId) => {
      const initialPos = furlongStartPositions[horseId];
      const currentPos = positions[horseId];
      return initialPos !== undefined && initialPos !== currentPos;
    };

    // Sort horses by current position
    const sortedRaceHorses = [...selectedRace].sort((a, b) => 
      (positions[a.horse.id] || a.gatePosition) - (positions[b.horse.id] || b.gatePosition)
    );

    // Group horses by position group
    const groupedHorses = {
      'LEADER': [],
      'FRONT': [],
      'MIDDLE': [],
      'BACK': [],
      'FAR_BACK': [],
    };

    sortedRaceHorses.forEach(entry => {
      const pos = positions[entry.horse.id] || entry.gatePosition;
      const group = getGroupName(pos);
      groupedHorses[group].push({ entry, pos });
    });

    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#fffbf0', border: '4px solid #78350f', borderRadius: '8px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#78350f', marginBottom: '8px' }}>FURLONG {currentFurlong} of {setup.furlongs}</h1>
            <p style={{ fontSize: '14px', color: '#b45309', marginBottom: '24px', fontWeight: 600 }}>Click a horse to select, then click another to swap • Yellow = Horse moved this furlong</p>
            
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.keys(groupedHorses).map(groupName => {
                const horses = groupedHorses[groupName];
                if (horses.length === 0) return null;

                return (
                  <div key={groupName}>
                    <div style={{
                      backgroundColor: '#78350f',
                      color: '#fffbf0',
                      padding: '12px 16px',
                      borderRadius: '4px',
                      fontWeight: 900,
                      fontSize: '16px',
                      marginBottom: '12px',
                      letterSpacing: '0.05em',
                    }}>
                      {getGroupHeader(groupName)}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {horses.map(({ entry, pos }) => {
                        const isSelected = selectedHorseId === entry.horse.id;
                        const hasMoved = hasHorseMoved(entry.horse.id);
                        
                        return (
                          <div
                            key={entry.horse.id}
                            onClick={() => handleHorseClick(entry.horse.id)}
                            style={{
                              border: isSelected ? '4px solid #dc2626' : '2px solid #78350f',
                              backgroundColor: isSelected ? '#fecaca' : hasMoved ? '#fef08a' : '#ffffff',
                              padding: '16px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                            onMouseOver={(e) => {
                              if (!isSelected && !hasMoved) {
                                e.currentTarget.style.backgroundColor = '#fef3c7';
                                e.currentTarget.style.borderColor = '#b45309';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!isSelected && !hasMoved) {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#78350f';
                              }
                            }}
                          >
                            <div>
                              <p style={{ fontWeight: 'bold', color: '#78350f', fontSize: '18px' }}>#{pos} - {entry.horse.name}</p>
                              <p style={{ fontSize: '13px', color: '#b45309', marginTop: '4px' }}>{entry.jockey.name}</p>
                            </div>
                            {isSelected && (
                              <div style={{ fontWeight: 900, color: '#dc2626', fontSize: '18px' }}>SELECTED</div>
                            )}
                            {hasMoved && !isSelected && (
                              <div style={{ fontWeight: 900, color: '#ca8a04', fontSize: '14px', textAlign: 'right' }}>
                                <div>MOVED from</div>
                                <div style={{ fontSize: '18px' }}>#{furlongStartPositions[entry.horse.id]}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNextFurlong}
              style={{
                marginTop: '32px',
                padding: '16px 24px',
                backgroundColor: '#78350f',
                color: '#fffbf0',
                fontWeight: 'bold',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                fontSize: '16px',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a2d0c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#78350f'}
            >
              {currentFurlong < setup.furlongs ? `Next Furlong →` : 'Finish Race'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fffbf0', border: '4px solid #78350f', borderRadius: '8px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#78350f', marginBottom: '4px', letterSpacing: '0.1em' }}>PLAAY</h1>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#92400e', marginBottom: '24px' }}>AT THE RACES</h2>

          {/* Race Setup */}
          <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
            <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '18px', marginBottom: '16px' }}>RACE SETUP</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>Racetrack (Optional)</label>
                <input
                  type="text"
                  value={setup.racetrack}
                  onChange={(e) => setSetup({ ...setup, racetrack: e.target.value })}
                  placeholder="e.g., Woodbine"
                  style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>Race # (Optional)</label>
                <input
                  type="text"
                  value={setup.raceNumber}
                  onChange={(e) => setSetup({ ...setup, raceNumber: e.target.value })}
                  placeholder="e.g., 8"
                  style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>Field Size</label>
                <select
                  value={setup.fieldSize}
                  onChange={(e) => setSetup({ ...setup, fieldSize: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => <option key={n} value={n}>{n} Horses</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>Furlongs</label>
                <input
                  type="number"
                  min="6"
                  max="12"
                  value={setup.furlongs}
                  onChange={(e) => setSetup({ ...setup, furlongs: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold', textAlign: 'center' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#78350f', marginBottom: '8px' }}>Track</label>
              <select
                value={setup.conditions}
                onChange={(e) => setSetup({ ...setup, conditions: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold' }}
              >
                {['FAST', 'NORMAL', 'SLOW'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Jockey & Horse Selection */}
          <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
            <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '18px', marginBottom: '16px' }}>POST POSITIONS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {Array(setup.fieldSize).fill(0).map((_, idx) => {
                const availableHorses = getAvailableHorses(idx);
                return (
                  <div key={idx} style={{ border: '2px solid #78350f', padding: '16px', borderRadius: '4px', backgroundColor: '#fef3c7' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 900, color: '#78350f', marginBottom: '12px' }}>GATE {idx + 1}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '6px' }}>Jockey</label>
                        <select
                          value={gateAssignments[idx].jockeyId}
                          onChange={(e) => handleGateChange(idx, 'jockeyId', e.target.value)}
                          style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}
                        >
                          <option value="">Select Jockey</option>
                          {getAvailableJockeys(idx).map(j => (
                            <option key={j.id} value={j.id}>
                              #{j.id} {j.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#78350f', marginBottom: '6px' }}>Horse</label>
                        <select
                          value={gateAssignments[idx].horseId}
                          onChange={(e) => handleGateChange(idx, 'horseId', e.target.value)}
                          style={{ width: '100%', padding: '8px', border: '2px solid #78350f', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}
                        >
                          <option value="">Select Horse</option>
                          {availableHorses.sort((a, b) => a.name.localeCompare(b.name)).map(h => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pre-Race Chart */}
          {selectedRace.length > 0 && (
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#ffffff', border: '2px solid #78350f', borderRadius: '4px' }}>
              <h3 style={{ fontWeight: 900, color: '#78350f', fontSize: '18px', marginBottom: '16px' }}>PRE-RACE ODDS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #78350f' }}>
                    <th style={{ textAlign: 'left', padding: '8px', fontWeight: 900, color: '#78350f' }}>GATE</th>
                    <th style={{ textAlign: 'left', padding: '8px', fontWeight: 900, color: '#78350f' }}>HORSE</th>
                    <th style={{ textAlign: 'left', padding: '8px', fontWeight: 900, color: '#78350f' }}>JOCKEY</th>
                    <th style={{ textAlign: 'left', padding: '8px', fontWeight: 900, color: '#78350f' }}>ODDS</th>
                  </tr>
                </thead>
                <tbody>
                  {oddsChart.sort((a, b) => a.gatePosition - b.gatePosition).map((entry, idx) => (
                    <tr key={entry.horse.id} style={{ backgroundColor: idx % 2 === 0 ? '#fef3c7' : '' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#78350f' }}>{entry.gatePosition}</td>
                      <td style={{ padding: '8px', color: '#78350f' }}>{entry.horse.name}</td>
                      <td style={{ padding: '8px', color: '#92400e', fontSize: '13px' }}>{entry.jockey.name}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#78350f' }}>{entry.odds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedRace.length === setup.fieldSize && (
            <button
              onClick={handleStartRace}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#78350f',
                color: '#fffbf0',
                fontWeight: 900,
                fontSize: '18px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a2d0c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#78350f'}
            >
              START RACE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
