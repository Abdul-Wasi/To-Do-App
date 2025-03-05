document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  applyTheme();
});

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskCategory = document.getElementById("taskCategory").value;
  let taskPriority = document.getElementById("taskPriority").value;
  let taskDate = document.getElementById("taskDate");
  let taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  let li = document.createElement("li");
  let dueDate = taskDate.value ? ` (Due: ${taskDate.value})` : "";
  li.classList.add(taskCategory.toLowerCase()); // Assign category class
  li.classList.add(taskPriority.toLowerCase()); // Assign priority class
  li.setAttribute("data-priority", taskPriority);
  li.innerHTML = `
        <span onclick="toggleTaskCompletion(this)">${taskInput.value} ${dueDate}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;

  taskList.appendChild(li);
  sortTasksByPriority();
  saveTasks();
  taskInput.value = "";
  taskDate.value = ""; // Reset date input
  updateProgress();
}

function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
  updateProgress();
}

function toggleTaskCompletion(taskSpan) {
  taskSpan.parentElement.classList.toggle("completed");
  saveTasks();
  updateProgress();
}

function clearAllTasks() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
  updateProgress();
}

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li span").forEach((span) => {
    let text = span.innerText;
    let completed = span.parentElement.classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear the list before loading

  storedTasks.forEach(({ text, completed }) => {
    let li = document.createElement("li");
    li.innerHTML = `
          <span onclick="toggleTaskCompletion(this)">${text}</span>
          <button class="delete-btn" onclick="deleteTask(this)">X</button>
      `;

    if (completed) li.classList.add("completed");
    taskList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  let tasks = document.querySelectorAll("#taskList li");
  let completedTasks = document.querySelectorAll("#taskList li.completed");
  let progress = tasks.length
    ? (completedTasks.length / tasks.length) * 100
    : 0;

  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("progressText").innerText = `${Math.round(
    progress
  )}% Completed`;
}

// Dark Mode Functions
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
}

function applyTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function searchTasks() {
  let query = document.getElementById("searchInput").value.toLowerCase();
  let tasks = document.querySelectorAll("#taskList li");

  tasks.forEach((task) => {
    let text = task.innerText.toLowerCase();
    task.style.display = text.includes(query) ? "flex" : "none";
  });
}

function sortTasksByPriority() {
  let taskList = document.getElementById("taskList");
  let tasks = Array.from(taskList.children);

  tasks.sort((a, b) => {
    let priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return (
      priorityOrder[a.getAttribute("data-priority")] -
      priorityOrder[b.getAttribute("data-priority")]
    );
  });

  tasks.forEach((task) => taskList.appendChild(task)); // Reorder list
}
