"use strict";
const STORAGE_KEY = "expenses";
const itemName = document.querySelector(".expense-input");
const amount = document.querySelector(".expense-amount");
const addExpenseBtn = document.querySelector(".add-expense");
const expenseList = document.querySelector(".expense-list");
const expenseListHeader = document.querySelector(".table-header");
const totalExpense = document.querySelector(".total-output");
// Generate unique id
const generateId = () => {
    return new Date().getTime(); 
};
// Validation logic
const validateExpense = async (name, amount) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!name || amount <= 0 || Number.isNaN(amount)) {
                reject(new Error("Invalid expense data"));
                return;
            }
            resolve();
        }, 200);
    });
};
// Save data
const saveDataToStorage = async (expenses) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        return { success: true, message: "Data saved to local storage" };
    }
    catch (error) {
        return { success: false, message: "Failed to save data in local storage" };
    }
};
// Load data
const loadDataFromStorage = async () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) {
            return [];
        }
        const expenseList = JSON.parse(savedData);
        if (!Array.isArray(expenseList)) {
            throw new Error("Invalid storage");
        }
        return expenseList;
    }
    catch (error) {
        console.error("Storage error:", error);
        return [];
    }
};
// Calculation logic
const calculateTotalExpenses = (expenses) => {
    try {
        let total = 0;
        for (let i = 0; i < expenses.length; i++) {
            const expense = expenses[i];
            total += expense.amount;
        }
        return total;
    }
    catch (error) {
        console.error("Calculation error:", error);
        return NaN;
    }
};
// UI logic
const generateExpenseReceipt = (expenses) => {
    expenseList.innerHTML = "";
    if (expenses.length <= 0) {
        expenseList.innerHTML = "No data";
    }
    for (let i = 0; i < expenses.length; i++) {
        // Loop all expense in expenses
        const expense = expenses[i];
        const expenseData = document.createElement("tr");
        expenseData.innerHTML = `
    <td>${expense.id}</td>
    <td>${expense.name}</td>
    <td>${expense.amount}</td>
    `;
        expenseList.appendChild(expenseData);
    }
    const total = calculateTotalExpenses(expenses);
    totalExpense.textContent = total.toString();
};
// Initialization
const loadApp = async () => {
    const expenses = await loadDataFromStorage();
    generateExpenseReceipt(expenses);
};
loadApp().catch(console.error);
