function addPeopleInputs() {
    const numPeople = document.getElementById('num-people').value;
    const peopleInputs = document.getElementById('people-inputs');
    peopleInputs.innerHTML = '';

    for (let i = 1; i <= numPeople; i++) {
        const div = document.createElement('div');
        div.classList.add('input-group');
        div.innerHTML = `
            <label for="person-${i}-name">Nombre de la persona ${i}:</label>
            <input type="text" id="person-${i}-name" required>
            <label for="person-${i}-expense">Gasto de la persona ${i}:</label>
            <input type="number" id="person-${i}-expense" min="0" required>
        `;
        peopleInputs.appendChild(div);
    }
}

document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const numPeople = document.getElementById('num-people').value;
    let totalSpent = 0;
    const people = [];

    for (let i = 1; i <= numPeople; i++) {
        const name = document.getElementById(`person-${i}-name`).value;
        const expense = parseFloat(document.getElementById(`person-${i}-expense`).value);
        people.push({ name, expense });
        totalSpent += expense;
    }

    const averageExpense = totalSpent / numPeople;
    const results = document.getElementById('results');
    results.innerHTML = '<h2>Resultados</h2>';

    const balances = people.map(person => {
        const balance = averageExpense - person.expense;
        return { name: person.name, balance };
    });

    balances.forEach(person => {
        results.innerHTML += `
            <p>${person.name} debe ${person.balance >= 0 ? 'pagar' : 'recibir'} ${Math.abs(person.balance).toFixed(2)} pesos.</p>
        `;
    });

    // Calcular quién debe pagar a quién
    balances.sort((a, b) => a.balance - b.balance);

    let i = 0, j = balances.length - 1;
    const transactions = [];

    while (i < j) {
        const debit = balances[i];
        const credit = balances[j];
        const amount = Math.min(Math.abs(debit.balance), credit.balance);

        if (amount > 0) {
            if (debit.balance < 0) {
                transactions.push(`${debit.name} debe recibir ${amount.toFixed(2)} pesos de ${credit.name}`);
            } else {
                transactions.push(`${debit.name} debe pagar ${amount.toFixed(2)} pesos a ${credit.name}`);
            }
        }

        balances[i].balance += amount;
        balances[j].balance -= amount;

        if (balances[i].balance === 0) i++;
        if (balances[j].balance === 0) j--;
    }

    results.innerHTML += '<h3>Transacciones</h3>';
    transactions.forEach(transaction => {
        results.innerHTML += `<p>${transaction}</p>`;
    });
});