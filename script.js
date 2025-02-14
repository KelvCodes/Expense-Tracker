document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalDisplay = document.getElementById("total");
    const ctx = document.getElementById("expenseChart").getContext("2d");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    function updateUI() {
        expenseList.innerHTML = "";
        let total = 0;
        let categoryTotals = {};

        expenses.forEach((expense, index) => {
            total += expense.amount;

            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;

            const li = document.createElement("li");
            li.innerHTML = `${expense.category}: $${expense.amount} - ${expense.description} 
                <button onclick="deleteExpense(${index})">❌</button>`;
            expenseList.appendChild(li);
        });

        totalDisplay.textContent = total;
        localStorage.setItem("expenses", JSON.stringify(expenses));

        updateChart(categoryTotals);
    }

    function updateChart(categoryTotals) {
        if (window.expenseChart) {
            window.expenseChart.destroy();
        }

        window.expenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"]
                }]
            }
        });
    }

    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        updateUI();
    };

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value.trim();
        const description = document.getElementById("description").value.trim();

        if (!amount || !category) return;

        expenses.push({ amount, category, description });
        updateUI();

        form.reset();
    });

    updateUI();
});
