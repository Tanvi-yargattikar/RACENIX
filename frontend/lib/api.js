const API_BASE = 'https://api.jolpi.ca/ergast/f1';
const CACHE_TTL = 60 * 1000;

export async function fetchAPI(endpoint) {
    const cacheKey = `f1_cache_${endpoint}`;
    const cached = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_TTL) return data;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
        return data;
    } catch (err) {
        console.error('Fetch error for', endpoint, err);
        if (cached) return JSON.parse(cached).data;
        throw err;
    }
}

export async function getStats() {
    const seasonsRes = await fetchAPI('/seasons.json?limit=100');
    const seasons = seasonsRes.MRData.SeasonTable.Seasons.map(s => parseInt(s.season)).sort((a,b)=>b-a);
    const latestYear = seasons[0];

    const currentDrivers = await fetchAPI('/current/drivers.json?limit=100');
    
    return {
        total_races: seasons.length * 20, 
        total_drivers: 864, // Historical constant
        seasons_count: seasons.length,
        latest_year: latestYear,
        years: seasons,
        active_drivers: currentDrivers.MRData.DriverTable.Drivers.map(d => ({
            id: d.driverId,
            name: `${d.givenName} ${d.familyName}`
        }))
    };
}

export function computeConsistency(races) {
    let drivers = {};
    races.forEach(race => {
        race.Results.forEach(res => {
            const name = `${res.Driver.givenName} ${res.Driver.familyName}`;
            if (!drivers[name]) {
                drivers[name] = { 
                    driver: name, 
                    pos: [], 
                    qual: [], 
                    dnf_count: 0, 
                    races_count: 0,
                    driverId: res.Driver.driverId
                };
            }
            drivers[name].races_count++;
            drivers[name].pos.push(parseInt(res.position));
            drivers[name].qual.push(res.grid === "0" ? 20 : parseInt(res.grid));
            
            const status = res.status.toLowerCase();
            const finished = status === 'finished' || status.includes('+');
            if (!finished) drivers[name].dnf_count++;
        });
    });

    const results = Object.values(drivers).map(d => {
        if (d.races_count < 3) return null; 

        d.avg_finish = d.pos.reduce((a,b)=>a+b,0) / d.races_count;
        d.avg_qual = d.qual.reduce((a,b)=>a+b,0) / d.races_count;
        d.dnf_rate = (d.dnf_count / d.races_count) * 100;

        const posVar = d.pos.reduce((acc, val) => acc + Math.pow(val - d.avg_finish, 2), 0) / d.races_count;
        const qualVar = d.qual.reduce((acc, val) => acc + Math.pow(val - d.avg_qual, 2), 0) / d.races_count;

        d.finish_variance = posVar || 0;
        d.qual_variance = qualVar || 0;
        return d;
    }).filter(Boolean);

    if (!results.length) return [];

    const maxP = Math.max(...results.map(d => d.finish_variance));
    const minP = Math.min(...results.map(d => d.finish_variance));
    const maxQ = Math.max(...results.map(d => d.qual_variance));
    const minQ = Math.min(...results.map(d => d.qual_variance));

    results.forEach(d => {
        const normP = maxP > minP ? (d.finish_variance - minP) / (maxP - minP) : 0;
        const normQ = maxQ > minQ ? (d.qual_variance - minQ) / (maxQ - minQ) : 0;
        
        d.consistency_score = (0.7 * normP) + (0.3 * normQ);
        d.final_score = d.consistency_score + (0.1 * (d.dnf_rate / 100)); // Lower score = more consistent
    });

    return results.sort((a,b) => a.final_score - b.final_score);
}

export async function getYearRankings(year) {
    const data = await fetchAPI(`/${year}/results.json?limit=1000`);
    const races = data.MRData.RaceTable.Races;
    return computeConsistency(races);
}

export async function getDriverTrend(driverName, driverId, recentYears) {
    const fetchPromises = recentYears.map(yr => getYearRankings(yr));
    const allRankings = await Promise.all(fetchPromises);
    
    const trends = [];
    allRankings.forEach((rankings, index) => {
        const driverStat = rankings.find(d => d.driverId === driverId);
        if (driverStat) {
            trends.push({
                year: recentYears[index],
                score: driverStat.final_score
            });
        }
    });
    return trends;
}

export async function getActiveDrivers(year) {
    const data = await fetchAPI(`/${year}/drivers.json?limit=100`);
    return data.MRData.DriverTable.Drivers.map(d => ({
        id: d.driverId,
        name: `${d.givenName} ${d.familyName}`
    }));
}
