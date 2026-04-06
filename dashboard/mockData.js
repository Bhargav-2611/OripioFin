/**
 * mockData.js
 * Contains global data for the FinTrack Dashboard.
 */

// 1. Yearly Balance Trend (Updated for 2025-2026)
var balanceTrend = [
    { month: "Jan 25", balance: 5000 }, { month: "Feb 25", balance: 5800 },
    { month: "Mar 25", balance: 6400 }, { month: "Apr 25", balance: 7200 },
    { month: "May 25", balance: 8100 }, { month: "Jun 25", balance: 8900 },
    { month: "Jul 25", balance: 9500 }, { month: "Aug 25", balance: 10200 },
    { month: "Sep 25", balance: 11000 }, { month: "Oct 25", balance: 10800 },
    { month: "Nov 25", balance: 11500 }, { month: "Dec 25", balance: 12400 },
    { month: "Jan 26", balance: 13100 }, { month: "Feb 26", balance: 14200 },
    { month: "Mar 26", balance: 15100 }, { month: "Apr 26", balance: 16037 }
];

// 2. Transaction History
var mockTransactions = [
    // --- APRIL 2026 ---
    { id: 1, desc: "Monthly Salary", cat: "Salary", date: "2026-04-01", amt: 5200, type: "income", status: "Completed", orderId: "INV_1001" },
    { id: 2, desc: "Apartment Rent", cat: "Bills", date: "2026-04-02", amt: 1200, type: "expense", status: "Completed", orderId: "INV_1002" },
    { id: 3, desc: "Whole Foods Market", cat: "Food", date: "2026-04-03", amt: 145, type: "expense", status: "Completed", orderId: "INV_1003" },
    { id: 4, desc: "Amazon Shopping", cat: "Shopping", date: "2026-04-04", amt: 85, type: "expense", status: "Completed", orderId: "INV_1004" },
    { id: 5, desc: "Software License", cat: "Other", date: "2026-04-05", amt: 255, type: "expense", status: "Completed", orderId: "INV_1005" },
    { id: 6, desc: "Starbucks Coffee", cat: "Food", date: "2026-04-06", amt: 12, type: "expense", status: "Completed", orderId: "INV_1006" },
    { id: 7, desc: "Uber Ride", cat: "Transport", date: "2026-04-07", amt: 32, type: "expense", status: "Completed", orderId: "INV_1007" },

    // --- MARCH 2026 ---
    { id: 8, desc: "Freelance Design", cat: "Freelance", date: "2026-03-28", amt: 1500, type: "income", status: "Completed", orderId: "INV_1008" },
    { id: 9, desc: "Grocery Store", cat: "Food", date: "2026-03-25", amt: 230, type: "expense", status: "Completed", orderId: "INV_1009" },
    { id: 10, desc: "Gas Station", cat: "Transport", date: "2026-03-22", amt: 65, type: "expense", status: "Completed", orderId: "INV_1010" },
    { id: 11, desc: "Gym Membership", cat: "Health", date: "2026-03-15", amt: 50, type: "expense", status: "Completed", orderId: "INV_1011" },
    { id: 12, desc: "Netflix", cat: "Other", date: "2026-03-15", amt: 15, type: "expense", status: "Completed", orderId: "INV_1012" },
    { id: 13, desc: "Flight Ticket", cat: "Other", date: "2026-03-12", amt: 450, type: "expense", status: "Pending", orderId: "INV_1013" },
    { id: 14, desc: "Pharmacy", cat: "Health", date: "2026-03-05", amt: 45, type: "expense", status: "Completed", orderId: "INV_1014" },

    // --- FEBRUARY 2026 ---
    { id: 15, desc: "Stock Dividend", cat: "Investment", date: "2026-02-25", amt: 340, type: "income", status: "Completed", orderId: "INV_1015" },
    { id: 16, desc: "Apple Store", cat: "Other", date: "2026-02-18", amt: 1299, type: "expense", status: "Completed", orderId: "INV_1016" },
    { id: 17, desc: "Electric Bill", cat: "Bills", date: "2026-02-10", amt: 120, type: "expense", status: "Completed", orderId: "INV_1017" },
    { id: 18, desc: "Internet Bill", cat: "Bills", date: "2026-02-05", amt: 80, type: "expense", status: "Completed", orderId: "INV_1018" },
    { id: 19, desc: "Consulting Fee", cat: "Freelance", date: "2026-02-01", amt: 800, type: "income", status: "Completed", orderId: "INV_1019" },

    // --- YEAR 2025 ---
    { id: 20, desc: "Christmas Bonus", cat: "Salary", date: "2025-12-20", amt: 2000, type: "income", status: "Completed", orderId: "INV_1020" },
    { id: 21, desc: "Car Repair", cat: "Transport", date: "2025-09-22", amt: 600, type: "expense", status: "Completed", orderId: "INV_1021" },
    { id: 22, desc: "Hotel Stay", cat: "Other", date: "2025-07-15", amt: 320, type: "expense", status: "Completed", orderId: "INV_1022" },
    { id: 23, desc: "Udemy Course", cat: "Other", date: "2025-05-12", amt: 45, type: "expense", status: "Completed", orderId: "INV_1024" }, // Added missing comma below

    // --- YEAR 2024 ---
    { id: 24, desc: "End of Year Bonus", cat: "Salary", date: "2024-12-28", amt: 1500, type: "income", status: "Completed", orderId: "INV_1025" },
    { id: 25, desc: "Winter Coat", cat: "Shopping", date: "2024-11-15", amt: 180, type: "expense", status: "Completed", orderId: "INV_1026" },
    { id: 26, desc: "Gym Registration", cat: "Health", date: "2024-11-01", amt: 100, type: "expense", status: "Completed", orderId: "INV_1027" },
    { id: 27, desc: "New Laptop", cat: "Other", date: "2024-09-10", amt: 1400, type: "expense", status: "Completed", orderId: "INV_1028" },
    { id: 28, desc: "Summer Vacation", cat: "Other", date: "2024-07-20", amt: 850, type: "expense", status: "Completed", orderId: "INV_1029" },
    { id: 29, desc: "Freelance Project", cat: "Freelance", date: "2024-06-15", amt: 2200, type: "income", status: "Completed", orderId: "INV_1030" },
    { id: 30, desc: "Property Tax", cat: "Bills", date: "2024-05-05", amt: 400, type: "expense", status: "Completed", orderId: "INV_1031" },
    { id: 31, desc: "Dentist Appointment", cat: "Health", date: "2024-03-12", amt: 150, type: "expense", status: "Completed", orderId: "INV_1032" },
    { id: 32, desc: "Birthday Dinner", cat: "Food", date: "2024-02-14", amt: 120, type: "expense", status: "Completed", orderId: "INV_1033" },
    { id: 33, desc: "Initial Deposit", cat: "Salary", date: "2024-01-01", amt: 3000, type: "income", status: "Completed", orderId: "INV_1034" }
];

// 3. Category Color Mapping
var categoryColors = {
    Salary: "#10b981",
    Freelance: "#3b82f6",
    Food: "#f97316",
    Transport: "#8b5cf6",
    Shopping: "#ec4899",
    Bills: "#ef4444",
    Health: "#06b6d4",
    Investment: "#6366f1",
    Other: "#64748b"
};

// --- SUBSCRIPTION DATA ---
const mockSubscriptions = [
    { 
        id: 1, 
        name: "Netflix", 
        cat: "Entertainment", 
        amt: 15.99, 
        nextDate: "2026-04-12", 
        icon: "fa-play", 
        color: "#E50914" 
    },
    { 
        id: 2, 
        name: "Adobe Creative", 
        cat: "Software", 
        amt: 52.99, 
        nextDate: "2026-04-18", 
        icon: "fa-pen-nib", 
        color: "#FF0000" 
    },
    { 
        id: 3, 
        name: "Spotify Premium", 
        cat: "Music", 
        amt: 10.99, 
        nextDate: "2026-04-20", 
        icon: "fa-music", 
        color: "#1DB954" 
    },
    { 
        id: 4, 
        name: "Google One", 
        cat: "Cloud", 
        amt: 2.99, 
        nextDate: "2026-05-01", 
        icon: "fa-cloud", 
        color: "#4285F4" 
    },
    { 
        id: 5, 
        name: "ChatGPT Plus", 
        cat: "AI Tools", 
        amt: 20.00, 
        nextDate: "2026-04-25", 
        icon: "fa-robot", 
        color: "#10a37f" 
    }
];