const sqlite3 = require('sqlite3').verbose();


// Отримайте дані з функції, яка надсилає заявки через Telegram
const dbPath = 'sof_jk_bot/db/data.db';

// Функція для отримання даних з таблиці в SQLite базі даних
function getApplicationsFromDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        const query = 'SELECT user_id, name, first_name, user_name, dataCreate, phone, street, house, apartment, typeReq, pcsQuests, car, timeQuests from requests';
        db.all(query, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }

            db.close();
        });
    });
}

async function getApplications() {
    try {
        const applications = await getApplicationsFromDatabase();
        return applications;
    } catch (error) {
        console.error('Помилка отримання даних з бази даних: ', error);
        return [];
    }
}

// Функція для відображення заявок в таблиці
function displayApplications() {
    var tableBody = document.querySelector("#applicationTable tbody");
    var applications = getApplications();

    applications.forEach(function(application, index) {
        var row = tableBody.insertRow();
        var data = Object.values(application);

        // Додаємо номер заявки
        var numberCell = row.insertCell();
        numberCell.textContent = index + 1;

        data.forEach(function(value, index) {
            var cell = row.insertCell();
            cell.textContent = value;
        });

        var actionsCell = row.insertCell();
        var confirmButton = document.createElement("button");
        confirmButton.textContent = "Підтвердити";
        confirmButton.classList.add("confirm-button"); // Додали клас для стилю
        confirmButton.addEventListener("click", function() {
            if (!confirmButton.disabled) {
                // Заблокувати кнопку після натискання
                confirmButton.disabled = true;
                rejectButton.disabled = true;
                confirmAction("підтвердити", row, application);
            }
        });

        var rejectButton = document.createElement("button");
        rejectButton.textContent = "Відхилити";
        rejectButton.classList.add("reject-button"); // Додали клас для стилю
        rejectButton.addEventListener("click", function() {
            if (!rejectButton.disabled) {
                // Заблокувати кнопку після натискання
                confirmButton.disabled = true;
                rejectButton.disabled = true;
                confirmAction("відхилити", row, application);
            }
        });

        actionsCell.appendChild(confirmButton);
        actionsCell.appendChild(rejectButton);
    });
}


// Функція для відображення підтвердження перед відхиленням або підтвердженням
function confirmAction(action, row, application) {
    if (confirm(`Ви впевнені, що бажаєте ${action} заявку?`)) {
        // Змінюємо статус заявки
        application.status = action === 'підтвердити' ? 'Підтверджено' : 'Відхилено';

        // Оновлюємо текст статусу в таблиці
        var statusCell = row.cells[row.cells.length - 2];
        statusCell.textContent = application.status;
    }
}



// Викликати функцію для відображення заявок при завантаженні сторінки
displayApplications();