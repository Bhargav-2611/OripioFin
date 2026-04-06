// --- 1. DOM ELEMENTS ---
const allMenuItems = document.querySelectorAll('.nav-item');
const allPageSections = document.querySelectorAll('.page-section');
const breadcrumbTitle = document.querySelector('.breadcrumb strong');
const roleSelector = document.getElementById('roleSelector');
const themeToggle = document.getElementById('themeToggle');
const menuSearchInput = document.getElementById('menuSearch');

// Dashboard Filters
const filterYear = document.getElementById('filterYear');
const filterMonth = document.getElementById('filterMonth');
const tableSearch = document.getElementById('tableSearch');
const mainTableBody = document.getElementById('transactionTableBody');
const dashboardTableBody = document.getElementById('dashboardRecentBody');

// Analytics Filters
const analyticsYear = document.getElementById('analyticsYear');
const analyticsCat = document.getElementById('analyticsCat');

// --- 2. THEME & ROLE MANAGEMENT ---
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function handleRoleChange(role) {
    const isAdmin = role === 'admin';
    document.body.classList.toggle('viewer-mode', !isAdmin);
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
}

if (roleSelector) {
    roleSelector.addEventListener('change', (e) => handleRoleChange(e.target.value));
}

// --- 3. SIDEBAR NAVIGATION & MENU SEARCH ---
function showSection(targetId) {
    allMenuItems.forEach(nav => nav.classList.remove('active'));
    allPageSections.forEach(s => s.classList.remove('active'));

    const targetMenu = document.querySelector(`[data-target="${targetId}"]`);
    const targetSection = document.getElementById(targetId);

    if (targetSection && targetMenu) {
        targetSection.classList.add('active');
        targetMenu.classList.add('active');
        breadcrumbTitle.innerText = targetMenu.innerText.split('\n')[0].trim();
    }
}

if (menuSearchInput) {
    menuSearchInput.addEventListener('input', function () {
        const filter = this.value.toLowerCase().trim();
        allMenuItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? "flex" : "none";
        });
    });
}

allMenuItems.forEach(item => {
    item.addEventListener('click', () => showSection(item.getAttribute('data-target')));
});

// --- 4. ENGINE: UPDATE DASHBOARD ---
function updateDashboard() {
    const selectedYear = filterYear ? filterYear.value : 'all';
    const selectedMonth = filterMonth ? filterMonth.value : 'all';
    const selectedType = document.getElementById('mainFilterType')?.value || 'all';
    const selectedCat = document.getElementById('mainFilterCat')?.value || 'all';
    const searchText = tableSearch ? tableSearch.value.toLowerCase().trim() : '';

    // A. TREND DATA (Line Chart - Broad Filter)
    // Only filtered by Time so the balance line stays consistent
    let trendTransactions = mockTransactions.filter(t => {
        const yearMatch = selectedYear === 'all' || t.date.startsWith(selectedYear);
        const monthMatch = selectedMonth === 'all' || t.date.split('-')[1] === selectedMonth;
        return yearMatch && monthMatch;
    });

    const trendMap = {};
    trendTransactions.forEach(t => {
        const mKey = t.date.substring(0, 7);
        if (!trendMap[mKey]) trendMap[mKey] = 0;
        trendMap[mKey] += (t.type === 'income' ? t.amt : -t.amt);
    });

    const sortedMonths = Object.keys(trendMap).sort();
    let rollingBalance = 0;
    const dynamicTrendData = sortedMonths.map(m => {
        rollingBalance += trendMap[m];
        return { month: m, balance: rollingBalance };
    });

    // B. UI DATA (Table & Donut - Strict Filter)
    let uiTransactions = mockTransactions.filter(t => {
        const yearMatch = selectedYear === 'all' || t.date.startsWith(selectedYear);
        const monthMatch = selectedMonth === 'all' || t.date.split('-')[1] === selectedMonth;
        const typeMatch = selectedType === 'all' || t.type === selectedType;
        const catMatch = selectedCat === 'all' || t.cat === selectedCat;
        const searchMatch = t.desc.toLowerCase().includes(searchText);
        return yearMatch && monthMatch && typeMatch && catMatch && searchMatch;
    });

    uiTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    let income = 0, expense = 0;
    const dashExpenseData = {};

    if (mainTableBody) mainTableBody.innerHTML = "";
    if (dashboardTableBody) dashboardTableBody.innerHTML = "";

    uiTransactions.forEach((t, index) => {
        if (t.type === 'income') income += t.amt;
        else {
            expense += t.amt;
            dashExpenseData[t.cat] = (dashExpenseData[t.cat] || 0) + t.amt;
        }

        const rowHTML = `
            <tr>
                <td><strong>${t.desc}</strong></td>
                <td>${t.cat}</td>
                <td style="text-transform: capitalize;">${t.type}</td>
                <td class="${t.type === 'income' ? 'text-green' : 'text-red'}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amt.toLocaleString()}
                </td>
                <td>${t.date}</td>
            </tr>`;

        if (mainTableBody) mainTableBody.innerHTML += rowHTML;
        if (dashboardTableBody && index < 8) dashboardTableBody.innerHTML += rowHTML;
    });

    // Update Totals Labels
    if (document.getElementById('displayBalance'))
        document.getElementById('displayBalance').innerText = `$${(income - expense).toLocaleString()}`;
    if (document.getElementById('displayIncome'))
        document.getElementById('displayIncome').innerText = `$${income.toLocaleString()}`;
    if (document.getElementById('displayExpense'))
        document.getElementById('displayExpense').innerText = `$${expense.toLocaleString()}`;

    // Update Dashboard Insights
    const topExp = Object.keys(dashExpenseData).length > 0 ? Object.keys(dashExpenseData).reduce((a, b) => dashExpenseData[a] > dashExpenseData[b] ? a : b) : "None";
    if (document.getElementById('topCatDisplay')) document.getElementById('topCatDisplay').innerText = topExp;

    let savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    if (document.getElementById('savingsDisplay')) document.getElementById('savingsDisplay').innerText = (savingsRate > 0 ? savingsRate : 0) + "%";

    // Render Dashboard Charts
    renderDashboardCharts(dynamicTrendData, dashExpenseData);
}

// --- 5. ANALYTICS ENGINE (Independent Filters) ---
function updateAnalytics() {
    const anaYear = analyticsYear ? analyticsYear.value : 'all';
    const anaCat = analyticsCat ? analyticsCat.value : 'all';

    let anaData = mockTransactions.filter(t => {
        const yearMatch = anaYear === 'all' || t.date.startsWith(anaYear);
        const catMatch = anaCat === 'all' || t.cat === anaCat;
        return yearMatch && catMatch;
    });

    const monthlyTotals = {};
    let maxExp = { amt: 0, cat: '' };

    if (anaData.length === 0) {
        if (document.getElementById('avgSpend')) document.getElementById('avgSpend').innerText = "$0.00";
        if (document.getElementById('highestExpense')) document.getElementById('highestExpense').innerText = "$0.00";
        renderAnalyticsBarChart({});
        return;
    }

    anaData.forEach(t => {
        const monthKey = t.date.substring(0, 7);
        if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = { inc: 0, exp: 0 };
        if (t.type === 'income') monthlyTotals[monthKey].inc += t.amt;
        else {
            monthlyTotals[monthKey].exp += t.amt;
            if (t.amt > maxExp.amt) maxExp = { amt: t.amt, cat: t.cat };
        }
    });

    const months = Object.keys(monthlyTotals);
    const totalExp = Object.values(monthlyTotals).reduce((sum, m) => sum + m.exp, 0);
    const avgMonthlyExp = totalExp / (months.length || 1);

    if (document.getElementById('avgSpend')) document.getElementById('avgSpend').innerText = `$${Math.round(avgMonthlyExp).toLocaleString()}`;
    if (document.getElementById('highestExpense')) document.getElementById('highestExpense').innerText = `$${maxExp.amt.toLocaleString()}`;
    if (document.getElementById('highestExpenseName')) document.getElementById('highestExpenseName').innerText = maxExp.cat || "Category";

    renderAnalyticsBarChart(monthlyTotals);
}

// --- 6. VISUALIZATION ---
function renderDashboardCharts(trendData, expenseData) {
    const ids = ['balanceChart', 'expenseDonutChart'];
    ids.forEach(id => { const c = Chart.getChart(id); if (c) c.destroy(); });

    const balCtx = document.getElementById('balanceChart');
    if (balCtx && trendData.length > 0) {
        new Chart(balCtx, {
            type: 'line',
            data: {
                labels: trendData.map(d => d.month),
                datasets: [{ label: 'Balance', data: trendData.map(d => d.balance), borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { onClick: null } } }
        });
    }

    const donutCtx = document.getElementById('expenseDonutChart');
    if (donutCtx) {
        const categories = Object.keys(expenseData);
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: Object.values(expenseData),
                    backgroundColor: categories.map(c => categoryColors[c] || '#64748b')
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', onClick: null } } }
        });
    }
}

function renderAnalyticsBarChart(monthlyTotals) {
    const barCanvas = document.getElementById('comparisonBarChart');
    if (!barCanvas) return;

    const labels = Object.keys(monthlyTotals).sort();
    const incomeData = labels.map(l => monthlyTotals[l].inc);
    const expenseData = labels.map(l => monthlyTotals[l].exp);

    const existingChart = Chart.getChart('comparisonBarChart');
    if (existingChart) existingChart.destroy();

    new Chart(barCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Income', data: incomeData, backgroundColor: '#10b981', borderRadius: 4 },
                { label: 'Expense', data: expenseData, backgroundColor: '#ef4444', borderRadius: 4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top', onClick: null } } }
    });
}

// --- 7. MODAL, EXPORT & SHARE ---
function openAddModal() { document.getElementById('transactionModal').style.display = 'flex'; }
function closeAddModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('addTransactionForm').reset();
}

document.getElementById('addTransactionForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const newTx = {
        id: Date.now(),
        desc: document.getElementById('newDesc').value,
        amt: parseFloat(document.getElementById('newAmt').value),
        type: document.getElementById('newType').value,
        cat: document.getElementById('newCat').value,
        date: new Date().toISOString().split('T')[0],
        status: "Completed"
    };
    mockTransactions.unshift(newTx);
    updateDashboard();
    updateAnalytics();
    closeAddModal();
});

const shareBtn = document.getElementById('shareBtn');
const shareMenu = document.getElementById('shareMenu');
if (shareBtn && shareMenu) {
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = shareMenu.style.display === 'none' || shareMenu.style.display === '';
        shareMenu.style.display = isHidden ? 'block' : 'none';
    });
}
window.addEventListener('click', () => { if (shareMenu) shareMenu.style.display = 'none'; });

function exportData(format) {
    let csvContent = "Description,Category,Type,Amount,Date\n";
    mockTransactions.forEach(t => { csvContent += `${t.desc},${t.cat},${t.type},${t.amt},${t.date}\n`; });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FinTrack_Export.${format === 'xlsx' ? 'csv' : 'csv'}`;
    link.click();
}



// --- 10. SUBSCRIPTION ENGINE ---
function updateSubscriptions() {
    const grid = document.getElementById('subCardsGrid');
    if (!grid) return;

    grid.innerHTML = "";
    let totalMonthly = 0;
    let upcomingTotal = 0;
    let upcomingCount = 0;

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    mockSubscriptions.forEach(sub => {
        totalMonthly += sub.amt;

        // Check for renewals in the next 7 days
        const renewalDate = new Date(sub.nextDate);
        if (renewalDate >= today && renewalDate <= nextWeek) {
            upcomingTotal += sub.amt;
            upcomingCount++;
        }

        // Generate the Card HTML
        const cardHTML = `
            <div class="sub-card animated-fade-in">
                <div class="sub-card-top">
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div class="sub-logo" style="color: ${sub.color}; background: ${sub.color}15;">
                            <i class="fas ${sub.icon}"></i>
                        </div>
                        <div class="sub-info">
                            <h4>${sub.name}</h4>
                            <p>${sub.cat}</p>
                        </div>
                    </div>
                    <span class="status-pill active">Active</span>
                </div>
                <div class="sub-price">
                    $${sub.amt.toFixed(2)} 
                    <span style="font-size:12px; font-weight:400; color:#94a3b8;">/ mo</span>
                </div>
                <div class="sub-card-footer">
                    <div>
                        <p class="next-bill-label">Next Bill</p>
                        <p style="font-size:13px; font-weight:600; margin:0;">${sub.nextDate}</p>
                    </div>
                    <button class="btn-outline" style="padding: 5px 12px; font-size: 11px;">
                        Manage
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });

    // Update the Summary Stats
    if (document.getElementById('monthlySubTotal'))
        document.getElementById('monthlySubTotal').innerText = `$${totalMonthly.toFixed(2)}`;

    if (document.getElementById('upcomingSubAmt'))
        document.getElementById('upcomingSubAmt').innerText = `$${upcomingTotal.toFixed(2)}`;

    if (document.getElementById('upcomingSubCount'))
        document.getElementById('upcomingSubCount').innerText = `${upcomingCount} payments due this week`;

    // Dynamic Progress Bar (Updates based on total)
    const progressBar = document.getElementById('subProgressFill');
    if (progressBar) {
        const percent = Math.min((totalMonthly / 500) * 100, 100);
        progressBar.style.width = percent + "%";
    }
}

// --- 11. SUBSCRIPTION MODAL LOGIC ---

// --- 10. SUBSCRIPTION ENGINE (WITH REMOVE LOGIC) ---
function updateSubscriptions() {
    const grid = document.getElementById('subCardsGrid');
    if (!grid) return;

    grid.innerHTML = "";
    let totalMonthly = 0;
    let upcomingTotal = 0;
    let upcomingCount = 0;

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    mockSubscriptions.forEach(sub => {
        totalMonthly += sub.amt;

        const renewalDate = new Date(sub.nextDate);
        if (renewalDate >= today && renewalDate <= nextWeek) {
            upcomingTotal += sub.amt;
            upcomingCount++;
        }

        const cardHTML = `
            <div class="sub-card animated-fade-in" id="sub-card-${sub.id}">
                <div class="sub-card-top">
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div class="sub-logo" style="color: ${sub.color}; background: ${sub.color}15;">
                            <i class="fas ${sub.icon}"></i>
                        </div>
                        <div class="sub-info">
                            <h4>${sub.name}</h4>
                            <p>${sub.cat}</p>
                        </div>
                    </div>
                    <span class="status-pill active">Active</span>
                </div>
                <div class="sub-price">
                    $${sub.amt.toFixed(2)} 
                    <span style="font-size:12px; font-weight:400; color:#94a3b8;">/ mo</span>
                </div>
                <div class="sub-card-footer" id="footer-${sub.id}">
                    <div>
                        <p class="next-bill-label">Next Bill</p>
                        <p style="font-size:13px; font-weight:600; margin:0;">${sub.nextDate}</p>
                    </div>
                    <button class="btn-outline" onclick="showRemoveOption(${sub.id})" id="manage-btn-${sub.id}">
                        Manage
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });

    // Update Headers
    if(document.getElementById('monthlySubTotal'))
        document.getElementById('monthlySubTotal').innerText = `$${totalMonthly.toFixed(2)}`;
    if(document.getElementById('upcomingSubAmt'))
        document.getElementById('upcomingSubAmt').innerText = `$${upcomingTotal.toFixed(2)}`;
    if(document.getElementById('upcomingSubCount'))
        document.getElementById('upcomingSubCount').innerText = `${upcomingCount} payments due this week`;
}

// --- 11. MANAGE & REMOVE LOGIC ---

function showRemoveOption(id) {
    const footer = document.getElementById(`footer-${id}`);
    const manageBtn = document.getElementById(`manage-btn-${id}`);
    
    // Change Manage button to a Red Remove button
    manageBtn.outerHTML = `
        <button class="btn-primary" 
                style="background: #ef4444; border-color: #ef4444; padding: 5px 12px; font-size: 11px;" 
                onclick="confirmRemove(${id})">
            Remove?
        </button>
    `;
}

function confirmRemove(id) {
    // 1. Remove from the array
    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
        mockSubscriptions.splice(index, 1);
    }

    // 2. Refresh the UI
    updateSubscriptions();
    
    // 3. Optional: Sync with Dashboard if needed
    updateDashboard();
}

// --- 12. UPGRADE MODAL LOGIC ---

function openUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.style.display = 'flex';
        // Optional: Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden'; 
    }
}

function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.style.display = 'none';
        // Restore scrolling
        document.body.style.overflow = 'auto'; 
    }
}

// Close upgrade modal when clicking the dark backdrop
window.addEventListener('click', (e) => {
    const modal = document.getElementById('upgradeModal');
    if (e.target === modal) closeUpgradeModal();
});

// --- 8. INITIALIZE ---
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    handleRoleChange(roleSelector?.value || 'admin');

    // Dashboard Filters
    const dashFilters = [filterYear, filterMonth, tableSearch, document.getElementById('mainFilterType'), document.getElementById('mainFilterCat')];
    dashFilters.forEach(f => { if (f) f.addEventListener(f.tagName === 'INPUT' ? 'input' : 'change', updateDashboard); });

    // Analytics Separate Filters
    if (analyticsYear) analyticsYear.addEventListener('change', updateAnalytics);
    if (analyticsCat) analyticsCat.addEventListener('change', updateAnalytics);

    updateDashboard();
    updateAnalytics();
    updateSubscriptions();
};
