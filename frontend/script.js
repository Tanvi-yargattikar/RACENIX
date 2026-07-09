import { getStats, getYearRankings, getDriverTrend, getActiveDrivers } from './lib/api.js';

// GSAP & ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

// Chart Registry
let top10Chart = null;
let trendChart = null;
let compareChart = null;

// Global State
let currentView = 'dashboard';
let worldRankingData = [];
let availableDriversInfo = [];
let currentStats = null;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const yearSelect = document.getElementById('year-select');
const trendDriverSelect = document.getElementById('trend-driver-select');
const compareA = document.getElementById('compare-a');
const compareB = document.getElementById('compare-b');
const rankingSearch = document.getElementById('ranking-search');
const rankingBody = document.getElementById('ranking-body');

window.switchView = function(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(`${viewName}-view`).classList.remove('hidden');
    document.getElementById(`nav-${viewName}`).classList.add('active');
    currentView = viewName;

    if (viewName === 'ranking' && worldRankingData.length === 0) loadWorldRanking();
    if (viewName === 'compare') updateComparison();
}

// App Initialization
async function init() {
    showLoading(true);
    try {
        const stats = await getStats();
        currentStats = stats;

        document.getElementById('stat-races').textContent = stats.total_races.toLocaleString() + '+';
        document.getElementById('stat-drivers').textContent = stats.total_drivers + '+';
        document.getElementById('stat-seasons').textContent = stats.seasons_count;

        yearSelect.innerHTML = stats.years.map(y => `<option value="${y}">${y}</option>`).join('');
        const latestYear = stats.latest_year;
        document.getElementById('display-year').textContent = latestYear;
        yearSelect.value = latestYear;

        const drivers = await getActiveDrivers(latestYear);
        availableDriversInfo = drivers;

        const driverOptions = drivers.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        trendDriverSelect.innerHTML = driverOptions;
        compareA.innerHTML = driverOptions;
        compareB.innerHTML = driverOptions;

        if (drivers.length > 0) {
            trendDriverSelect.value = drivers[0].id;
            compareA.value = drivers[0].id;
            compareB.value = drivers.length > 1 ? drivers[1].id : drivers[0].id;
        }

        setupEventListeners();

        await Promise.all([
            updateTop10(),
            updateTrend()
        ]);

        lucide.createIcons();

    } catch (error) {
        console.error("Initialization failed:", error);
    } finally {
        showLoading(false);
    }
}

function setupEventListeners() {
    yearSelect.addEventListener('change', async (e) => {
        document.getElementById('display-year').textContent = e.target.value;
        await updateTop10();
    });

    trendDriverSelect.addEventListener('change', updateTrend);

    rankingSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = worldRankingData.filter(d => d.driver.toLowerCase().includes(term));
        renderRankingTable(filtered);
    });

    compareA.addEventListener('change', updateComparison);
    compareB.addEventListener('change', updateComparison);
}

// Chart Renderers (Live Data via API)
async function updateTop10() {
    try {
        const data = await getYearRankings(yearSelect.value);
        renderTop10Chart(data.slice(0, 10));
    } catch (e) { console.error(e); }
}

async function updateTrend() {
    try {
        const driverId = trendDriverSelect.value;
        const driverName = trendDriverSelect.options[trendDriverSelect.selectedIndex]?.text;
        
        const latestYear = parseInt(yearSelect.value);
        const recentYears = [latestYear - 4, latestYear - 3, latestYear - 2, latestYear - 1, latestYear].filter(y => y >= currentStats.years[currentStats.years.length - 1]);
        
        const trendData = await getDriverTrend(driverName, driverId, recentYears);
        renderTrendChart(trendData);
    } catch (e) { console.error(e); }
}

async function loadWorldRanking() {
    showLoading(true);
    try {
        worldRankingData = await getYearRankings(yearSelect.value);
        renderRankingTable(worldRankingData);
    } catch (e) { console.error(e); }
    showLoading(false);
}

async function updateComparison() {
    showLoading(true);
    try {
        const idA = compareA.value;
        const nmA = compareA.options[compareA.selectedIndex]?.text || '';
        const idB = compareB.value;
        const nmB = compareB.options[compareB.selectedIndex]?.text || '';

        const latestYear = parseInt(yearSelect.value);
        const ranks = await getYearRankings(latestYear);
        
        const statA = ranks.find(d => d.driverId === idA) || { final_score: 0, dnf_rate: 0, avg_qual: 0, avg_finish: 0, races_count: 0 };
        const statB = ranks.find(d => d.driverId === idB) || { final_score: 0, dnf_rate: 0, avg_qual: 0, avg_finish: 0, races_count: 0 };
        
        const renderCard = (name, driver) => `
            <div class="card glass-card comparison-card">
                <div class="comp-header">
                    <h3 class="comp-name">${name}</h3>
                    <span class="badge">SCORE: ${driver.final_score.toFixed(3)}</span>
                </div>
                <div class="comp-stats-list">
                    <div class="comp-stat-item"><span class="comp-stat-label">RACES</span><span class="comp-stat-val">${driver.races_count}</span></div>
                    <div class="comp-stat-item"><span class="comp-stat-label">DNF</span><span class="comp-stat-val">${driver.dnf_rate.toFixed(1)}%</span></div>
                    <div class="comp-stat-item"><span class="comp-stat-label">GRID</span><span class="comp-stat-val">${driver.avg_qual.toFixed(1)}</span></div>
                    <div class="comp-stat-item"><span class="comp-stat-label">FINISH</span><span class="comp-stat-val">${driver.avg_finish.toFixed(1)}</span></div>
                </div>
            </div>
        `;

        document.getElementById('compare-results').innerHTML = renderCard(nmA, statA) + renderCard(nmB, statB);

        // Chart (fetch 5 years)
        const recentYears = [latestYear - 4, latestYear - 3, latestYear - 2, latestYear - 1, latestYear];
        const [trendA, trendB] = await Promise.all([
            getDriverTrend(nmA, idA, recentYears),
            getDriverTrend(nmB, idB, recentYears)
        ]);
        
        renderCompareChart(trendA, nmA, trendB, nmB, recentYears);

    } catch (e) { console.error(e); }
    showLoading(false);
}

function renderCompareChart(trendA, nmA, trendB, nmB, recentYears) {
    const chartContainer = document.getElementById('compare-chart-container');
    if (!chartContainer) return;
    chartContainer.classList.remove('hidden');

    const ctx = document.getElementById('compareChart').getContext('2d');
    if (compareChart) compareChart.destroy();

    const getYearData = (trend, years) => years.map(y => {
        const found = trend.find(t => t.year === y);
        return found ? found.score : null;
    });

    compareChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: recentYears,
            datasets: [
                {
                    label: nmA,
                    data: getYearData(trendA, recentYears),
                    borderColor: '#e10600',
                    tension: 0.3,
                    spanGaps: true
                },
                {
                    label: nmB,
                    data: getYearData(trendB, recentYears),
                    borderColor: '#ffffff',
                    tension: 0.3,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { reverse: true, grid: { color: 'rgba(255,255,255,0.05)' } } },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });
}

function renderTop10Chart(data) {
    const canvas = document.getElementById('top10Chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (top10Chart) top10Chart.destroy();

    top10Chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.driver),
            datasets: [{
                label: 'Consistency Score (Lower is better)',
                data: data.map(d => d.final_score),
                backgroundColor: 'rgba(225, 6, 0, 0.7)',
                borderColor: '#e10600',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ea0a3' } },
                y: { ticks: { color: '#fff', font: { family: 'Inter', size: 10 } } }
            }
        }
    });
}

function renderTrendChart(trendData) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.map(d => d.year),
            datasets: [{
                label: 'Consistency Score',
                data: trendData.map(d => d.score),
                borderColor: '#e10600',
                backgroundColor: 'rgba(225, 6, 0, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#9ea0a3' } },
                y: { reverse: true, ticks: { color: '#9ea0a3' } } // Lower score is better
            }
        }
    });
}

function renderRankingTable(data) {
    rankingBody.innerHTML = data.map((d, i) => `
        <tr>
            <td><span class="rank-text">#${i + 1}</span></td>
            <td><span class="driver-name-cell">${d.driver}</span></td>
            <td>${d.races_count}</td>
            <td>${d.avg_finish.toFixed(1)}</td>
            <td>${d.dnf_rate.toFixed(1)}%</td>
            <td><span class="score-cell">${d.final_score.toFixed(3)}</span></td>
            <td><button class="btn-profile" onclick="viewDriverDetail('${d.driverId}')">VIEW</button></td>
        </tr>
    `).join('');
}

function showLoading(show) {
    loadingOverlay.classList.toggle('hidden', !show);
}

window.viewDriverDetail = async (id) => {
    switchView('compare');
    compareA.value = id;
    if (compareB.value === id) {
        compareB.value = availableDriversInfo.find(d => d.id !== id)?.id || id;
    }
    updateComparison();
};

async function askAI() {
  const response = await fetch("http://localhost:5000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "Explain F1 driver consistency"
    })
  });

  const data = await response.text();
  document.getElementById("result").innerText = data;
}

init();
