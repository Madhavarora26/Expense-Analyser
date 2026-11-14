//Expense Analyser

// Step 1
const fs = require('fs');
const _ = require('lodash');

//Step 2
const parseExpense = (text) => {
    return text.trim().split('\n').map((line) => {
        const parts = line.trim().split(',');

        return { category: parts[0], amount: Number(parts[1]) };
    });
};

//Step 3 Read File
//readFileSync is blocking: the program waits here until the whole file is read
console.time('sync read');
const text = fs.readFileSync('expenses.txt', 'utf-8');
console.timeEnd('sync read');

const expenses = parseExpense(text);

console.log('First expense:', expenses[0]);

//Step 4

//reduce : combine all items into one value it is staring from 0
const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
console.log('Total spent:', totalSpent);

//filter: it filter the items from the array in which the test is true
//this means whatever amount is bigger than 500 it will be listed in an another array
const bigExpenses = expenses.filter(e => e.amount > 500);
console.log('Big expenses:', bigExpenses.length, bigExpenses);

//map:it will make a new array copies the array in the form of objects
//this ...e will first make a copy then change the anmount
const withFee = expenses.map(e => ({ ...e, amount: e.amount + 50 }));
console.log('With fee:', withFee[0].amount, '| Original:', expenses[0].amount);


// Step 5 Total Category

const totalsByCategory = {};

for (const e of expenses) {
    if (totalsByCategory[e.category] === undefined) {
        totalsByCategory[e.category] = 0;
    }
    totalsByCategory[e.category] += e.amount;
}
console.log('Totals by category:', totalsByCategory);

// Step 6 Summary lines with switch and a ternary

function budgetNote(category) {
  let note;
  switch (category) {
    case 'food':   note = 'Daily need'; break;
    case 'travel': note = 'Commute';    break;
    case 'books':  note = 'Study';      break;
    default:       note = 'Other';
  }
  return note;
}

const categories = Object.keys(totalsByCategory);

categories.forEach(cat => {
  const total = totalsByCategory[cat];
  const status = total > 1500 ? 'OVER 1500' : 'OK';   // the ternary
  console.log(`${cat} (${budgetNote(cat)}): Rs ${total} - ${status}`);
});

// Step 7 Closure: budget tracker

function createBudgetTracker(limit) {
  let spent = 0;                       // private: only the inner function can see it
  return function (amount) {
    spent += amount;                   // remembers spent from the previous call
    const remaining = limit - spent;
    return remaining >= 0
      ? `Remaining: ${remaining}`
      : `Over budget by ${-remaining}`;
  };
}

const track = createBudgetTracker(1000);
console.log(track(300));  // Remaining: 700
console.log(track(500));  // Remaining: 200
console.log(track(400));  // Over budget by 200

// Step 8 Async read

console.log('Async read started');

fs.readFile('expenses.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error:', err.message);
    return;
  }
  console.log('Async read finished');
});

for (let i = 0; i < 1000000; i++) {}   // busy work
console.log('Loop finished');
