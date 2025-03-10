const backendURL = "http://192.168.0.65:5200";

document.addEventListener("DOMContentLoaded", function () {
  getTasks();

  async function addTaskToDatabase(taskText) {
    const response = await fetch(`${backendURL}/add-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: taskText }),
    });
    const data = await response.json();
    return data.id;
  }

  async function getTasks() {
    try {
      const response = await fetch(`${backendURL}/get-tasks`);
      const tasks = await response.json();

      let container = document.getElementById("container");
      container.innerHTML = "";

      tasks.forEach((task) => {
        addTaskToUI(task.id, task.content);
      });
    } catch (err) {
      console.error("Błąd pobierania zadań:", err);
    }
  }

  async function editTaskInDatabase(taskId, newText) {
    try {
      const response = await fetch(`${backendURL}/edit-task/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newText }),
      });
      return response.ok;
    } catch (err) {
      console.error("Błąd edycji zadania:", err);
      return false;
    }
  }

  async function deleteTaskFromDatabase(taskId) {
    try {
      await fetch(`${backendURL}/delete-task/${taskId}`, {
        method: "DELETE",
      });
      return true;
    } catch (err) {}
  }

  async function taskAdded() {
    let addTask = document.getElementById("add-task").value;
    if (addTask.trim() === "") return;

    const taskId = await addTaskToDatabase(addTask);
    if (!taskId) {
      alert("Błąd podczas dodawania zadania do bazy danych.");
      return;
    }

    addTaskToUI(taskId, addTask);
    document.getElementById("add-task").value = "";
  }

  function addTaskToUI(taskId, taskText) {
    let div = document.createElement("div");
    div.classList.add("task-div");

    let newTaskParagraph = document.createElement("p");
    let taskContent = document.createElement("span");
    taskContent.textContent = taskText;

    let buttonDelete = document.createElement("button");
    buttonDelete.textContent = "Usuń";
    buttonDelete.classList.add("delete-btn");

    let buttonEdit = document.createElement("button");
    buttonEdit.textContent = "Edytuj";
    buttonEdit.classList.add("button-edit");

    buttonDelete.onclick = async function () {
      const success = await deleteTaskFromDatabase(taskId);
      if (success) div.remove();
    };

    buttonEdit.onclick = async function () {
      let newText = prompt("Edytuj zadanie:", taskContent.textContent);
      if (newText !== null && newText.trim() !== "") {
        const success = await editTaskInDatabase(taskId, newText);
        if (success) {
          taskContent.textContent = newText;
        } else {
          alert("Błąd podczas edycji zadania w bazie danych.");
        }
      }
    };

    newTaskParagraph.appendChild(taskContent);
    div.appendChild(newTaskParagraph);
    div.appendChild(buttonDelete);
    div.appendChild(buttonEdit);

    document.getElementById("container").appendChild(div);
  }

  window.taskAdded = taskAdded;
});

// function taskAdded() {
//   let addTask = document.getElementById("add-task").value;
//   if (addTask.trim() === "") return;

//   let div = document.createElement("div");
//   div.classList.add("task-div");

//   let newTaskParagraph = document.createElement("p");

//   let taskText = document.createElement("span"); // Element na sam tekst zadania
//   taskText.textContent = addTask;

//   let dateTime = document.createElement("span"); // Element na datę i czas
//   dateTime.classList.add("date-styles");
//   dateTime.textContent = " (" + getCurrentDateTime() + ")";

//   let buttonDelete = document.createElement("button");
//   buttonDelete.textContent = "Usuń";
//   buttonDelete.classList.add("delete-btn");

//   let buttonEdit = document.createElement("button");
//   buttonEdit.textContent = "Edytuj";
//   buttonEdit.classList.add("edit-btn");

//   let buttonUp = document.createElement("button");
//   buttonUp.textContent = "Przesuń wyżej";
//   buttonUp.classList.add("up-btn");

//   let buttonDown = document.createElement("button");
//   buttonDown.textContent = "Przesuń w dół";
//   buttonDown.classList.add("down-btn");

//   let changeColor = document.createElement("select");
//   changeColor.classList.add("color-picker");

//   newTaskParagraph.appendChild(taskText);
//   newTaskParagraph.appendChild(dateTime);

//   div.appendChild(newTaskParagraph);
//   div.appendChild(buttonDelete);
//   div.appendChild(buttonEdit);
//   div.appendChild(buttonUp);
//   div.appendChild(buttonDown);
//   div.appendChild(changeColor);

//   changeColor.onchange = function () {
//     div.style.backgroundColor = changeColor.value;
//   };

//   buttonDelete.onclick = function () {
//     div.remove();
//   };

//   buttonEdit.onclick = function () {
//     editParagraph(taskText); // Przekazujemy tylko część tekstową bez daty
//   };

//   buttonUp.onclick = function () {
//     let previousTask = div.previousElementSibling;
//     if (previousTask) {
//       document.getElementById("container").insertBefore(div, previousTask);
//     }
//   };

//   buttonDown.onclick = function () {
//     let nextTask = div.nextElementSibling;
//     if (nextTask) {
//       document.getElementById("container").insertBefore(nextTask, div);
//     }
//   };

//   // tablica obiektów kolorow
//   let colors = [
//     { name: "Biały", value: "#ffffff" },
//     { name: "Czerwony", value: "#ff5733" },
//     { name: "Zielony", value: "#33ff57" },
//     { name: "Niebieski", value: "#3357ff" },
//     { name: "Żółty", value: "#f1c40f" },
//     { name: "Fioletowy", value: "#8e44ad" },
//     { name: "Szary", value: "#bdc3c7" },
//   ];

//   // petla forEach dla kazdego koloru przypisuje element HTML OPTIONS
//   // Tworzy nowy element <option> dla <select>.
//   // Ustawia wartość (value) opcji na kod koloru HEX (color.value).
//   // Ustawia tekst (textContent) opcji na nazwę koloru (color.name).
//   // Dodaje (appendChild) element <option> do listy rozwijanej (changeColor).
//   colors.forEach((color) => {
//     let option = document.createElement("option");
//     option.value = color.value;
//     option.textContent = color.name;
//     changeColor.appendChild(option);
//   });

//   // pobiera element HTML o id=container następnie tworzy nowy element div dziecko
//   document.getElementById("container").appendChild(div);

//   // pobiera element HTML o id=add-task i ustawiamy jego wartość value na pusty string ""
//   document.getElementById("add-task").value = "";

//   function editParagraph(taskTextElement) {
//     // przypisanie do zminnej okna dialogowego
//     // okno dialogowe posiada pierwszy argument czyli tytul i
//     // drugi argument ktory ustawia na wartosc domyslna pole tekstowe czyli
//     // wiadomosc ktora zostala wpisana

//     let newText = prompt("Edytuj zadanie:", taskTextElement.textContent);
//     if (newText !== null && newText.trim() !== "") {
//       // sprawdzenie czy uzytkownik nie anulowal
//       // // sprawdzenie czy uzytkownik nie wpisal pustych znakow
//       taskTextElement.textContent = newText;
//       // jesli warunek jest spelniony tekst zostanie zmieni6ony
//     }
//   }

//   function getCurrentDateTime() {
//     let now = new Date();
//     let day = String(now.getDate()).padStart(2, "0");
//     let month = String(now.getMonth() + 1).padStart(2, "0");
//     let year = now.getFullYear();
//     let hours = String(now.getHours()).padStart(2, "0");
//     let minutes = String(now.getMinutes()).padStart(2, "0");
//     let seconds = String(now.getSeconds()).padStart(2, "0");
//     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
//   }
// }
