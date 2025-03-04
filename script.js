document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  applyTheme();
});

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskDate = document.getElementById("taskDate");
  let taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") {
      alert("Please enter a task!");
      return;
  }

  let li = document.createElement("li");
    let dueDate = taskDate.value ? ` (Due: ${taskDate.value})` : "";
    li.innerHTML = `
        <span onclick="toggleTaskCompletion(this)">${taskInput.value} ${dueDate}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;

    taskList.appendChild(li);
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
  let progress = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;

  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("progressText").innerText = `${Math.round(progress)}% Completed`;
}

// Dark Mode Functions
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function applyTheme() {
  if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
  }
}
