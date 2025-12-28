interface Expense {
  id: string;
  name: string;
  amount: number;
}

type ExpenseList = Expense[];

interface StorageResult {
  success: boolean;
  message?: string;
}

const STORAGE_KEY: string = "expenses";

const itemName = document.querySelector("#expense-item") as HTMLInputElement;
const itemAmount = document.querySelector(
  "#expense-amount"
) as HTMLInputElement;

const addExpenseBtn = document.querySelector(
  ".add-expense"
) as HTMLButtonElement;

const expenseList = document.querySelector(
  ".expense-list tbody"
) as HTMLTableElement;

const expenseListHeader = document.querySelector(
  ".table-header"
) as HTMLTableRowElement;

const totalExpense = document.querySelector(
  ".total-output"
) as HTMLInputElement;

const clearBtn = document.querySelector(".clear") as HTMLButtonElement;

// Generate unique id
const generateId = (): number => {
  return Date.now();
};

// Validation logic
const validateExpense = async (name: string, amount: number): Promise<void> => {
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
const saveDataToStorage = async (
  expenses: ExpenseList
): Promise<StorageResult> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return { success: true, message: "Data saved to local storage" };
  } catch (error) {
    return { success: false, message: "Failed to save data in local storage" };
  }
};

// Load data
const loadDataFromStorage = async (): Promise<ExpenseList> => {
  try {
    const savedData: string | null = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const expenseList: unknown = JSON.parse(savedData);

    if (!Array.isArray(expenseList)) {
      throw new Error("Invalid storage");
    }

    return expenseList as ExpenseList;
  } catch (error) {
    console.error("Storage error:", error);
    return [];
  }
};

// Calculation logic
const calculateTotalExpenses = (expenses: ExpenseList): number => {
  try {
    let total: number = 0;

    for (let i = 0; i < expenses.length; i++) {
      const expense: Expense = expenses[i];
      total += expense.amount;
    }

    return total;
  } catch (error) {
    console.error("Calculation error:", error);
    return NaN;
  }
};

// UI logic
const generateExpenseReceipt = (expenses: ExpenseList) => {
  if (expenses.length <= 0) {
    expenseListHeader.parentElement!.classList.add("data-empty");
    return;
  }

  expenseListHeader.parentElement!.classList.remove("data-empty");
  expenseList.innerHTML = "";

  for (let i = 0; i < expenses.length; i++) {
    // Loop all expense in expenses
    const expense: Expense = expenses[i];

    const expenseData: HTMLTableRowElement = document.createElement("tr");

    expenseData.innerHTML = `
    <td>${expense.id}</td>
    <td>${expense.name}</td>
    <td>${expense.amount}</td>
    `;

    expenseList.appendChild(expenseData);
  }

  const total = calculateTotalExpenses(expenses);
  totalExpense.value = total.toString();
};

// Main logic
const addExpense = async (): Promise<void> => {
  const name: string = itemName.value;
  const amount: number = Number(itemAmount.value);

  // console.log(name, amount);

  try {
    await validateExpense(name, amount);

    const existingExpenses = await loadDataFromStorage();

    const newExpense: Expense = {
      id: generateId().toString(),
      name,
      amount,
    };

    existingExpenses.push(newExpense);

    const result = await saveDataToStorage(existingExpenses);

    if (!result.success) {
      throw new Error(result.message);
    }

    // console.log(result, "res");

    generateExpenseReceipt(existingExpenses);

    itemName.value = "";
    itemAmount.value = "";
  } catch (error) {
    console.error("Failed to add expense:", error);
    alert("Failed to add expense");
  }
};

// Remove logic
const removeExpense = async (): Promise<void> => {
  try {
    const existingExpenses = await loadDataFromStorage();

    if (!existingExpenses) {
      throw new Error("List is already empty");
    }

    expenseListHeader.parentElement!.classList.add("data-empty");
    expenseList.innerHTML = "";
    totalExpense.value = "0";

    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to add expense:", error);
  }
};

// Events
addExpenseBtn.addEventListener("click", (event) => {
  event.preventDefault();

  addExpense().catch(console.error);
});

clearBtn.addEventListener("click", () => {
  removeExpense().catch(console.error);
});

// Initialization
const loadApp = async (): Promise<void> => {
  const expenses: ExpenseList = await loadDataFromStorage();

  generateExpenseReceipt(expenses);
};

loadApp().catch(console.error);
