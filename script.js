function taskAdded() {
  let addTask = document.getElementById("add-task").value;
  if (addTask.trim() === "") return;

  let div = document.createElement("div");
  div.classList.add("task-div");

  let newTaskParagraph = document.createElement("p");

  let taskText = document.createElement("span"); // Element na sam tekst zadania
  taskText.textContent = addTask;

  let dateTime = document.createElement("span"); // Element na datę i czas
  dateTime.classList.add("date-styles");
  dateTime.textContent = " (" + getCurrentDateTime() + ")";

  let buttonDelete = document.createElement("button");
  buttonDelete.textContent = "Usuń";
  buttonDelete.classList.add("delete-btn");

  let buttonEdit = document.createElement("button");
  buttonEdit.textContent = "Edytuj";
  buttonEdit.classList.add("edit-btn");

  let buttonUp = document.createElement("button");
  buttonUp.textContent = "Przesuń wyżej";
  buttonUp.classList.add("up-btn");

  let buttonDown = document.createElement("button");
  buttonDown.textContent = "Przesuń w dół";
  buttonDown.classList.add("down-btn");

  let changeColor = document.createElement("select");
  changeColor.classList.add("color-picker");

  newTaskParagraph.appendChild(taskText);
  newTaskParagraph.appendChild(dateTime);

  div.appendChild(newTaskParagraph);
  div.appendChild(buttonDelete);
  div.appendChild(buttonEdit);
  div.appendChild(buttonUp);
  div.appendChild(buttonDown);
  div.appendChild(changeColor);

  changeColor.onchange = function () {
    div.style.backgroundColor = changeColor.value;
  };

  buttonDelete.onclick = function () {
    div.remove();
  };

  buttonEdit.onclick = function () {
    editParagraph(taskText); // Przekazujemy tylko część tekstową bez daty
  };

  buttonUp.onclick = function () {
    let previousTask = div.previousElementSibling;
    if (previousTask) {
      document.getElementById("container").insertBefore(div, previousTask);
    }
  };

  buttonDown.onclick = function () {
    let nextTask = div.nextElementSibling;
    if (nextTask) {
      document.getElementById("container").insertBefore(nextTask, div);
    }
  };

  let colors = [
    { name: "Biały", value: "#ffffff" },
    { name: "Czerwony", value: "#ff5733" },
    { name: "Zielony", value: "#33ff57" },
    { name: "Niebieski", value: "#3357ff" },
    { name: "Żółty", value: "#f1c40f" },
    { name: "Fioletowy", value: "#8e44ad" },
    { name: "Szary", value: "#bdc3c7" },
  ];

  colors.forEach((color) => {
    let option = document.createElement("option");
    option.value = color.value;
    option.textContent = color.name;
    changeColor.appendChild(option);
  });

  document.getElementById("container").appendChild(div);
  document.getElementById("add-task").value = "";

  function editParagraph(taskTextElement) {
    let newText = prompt("Edytuj zadanie:", taskTextElement.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskTextElement.textContent = newText;
    }
  }

  function getCurrentDateTime() {
    let now = new Date();
    let day = String(now.getDate()).padStart(2, "0");
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let year = now.getFullYear();
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}
