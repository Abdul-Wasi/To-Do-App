document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `
        <span onclick="editTask(this)">${taskInput.value}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;

  taskList.appendChild(li);
  saveTasks();
  taskInput.value = "";
}

function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
}

function editTask(taskElement) {
  let newText = prompt("Edit task:", taskElement.innerText);
  if (newText) {
    taskElement.innerText = newText;
    saveTasks();
  }
}

function clearAllTasks() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
}

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li span").forEach((span) => {
    tasks.push(span.innerText);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskList = document.getElementById("taskList");

  storedTasks.forEach((task) => {
    let li = document.createElement("li");
    li.innerHTML = `
            <span onclick="editTask(this)">${task}</span>
            <button class="delete-btn" onclick="deleteTask(this)">X</button>
        `;
    taskList.appendChild(li);
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}

// Apply theme on page load
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});
