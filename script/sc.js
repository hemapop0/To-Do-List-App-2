
/* ==============================
   1. Load saved tasks
============================== */

const savedTasks = localStorage.getItem("tasks");
const tasks = savedTasks ? JSON.parse(savedTasks) : [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ==============================
   2. Get HTML Elements
============================== */

const editModal = document.getElementById("edit-modal");

const addform = document.getElementById("sec02__form");
const titletask = document.getElementById("Title__task");
const titleDescription = document.getElementById("Title__des");
const taskDate = document.getElementById("Title__date");

const tasksContainer = document.getElementById("task__list");
const emptyMessage = document.getElementById("empty-message");

const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("edit-title");
const editDescription = document.getElementById("edit-description");
const editDate = document.getElementById("edit-date");
const cancelEdit = document.getElementById("cancel-edit");

const searchInput = document.getElementById("search__input");
const filterButtons = document.querySelectorAll(".filter-btn");

/* ==============================
   3. Variables
============================== */

let currentFilter = "all";
let editingTask = null;

/* ==============================
   4. Render Tasks
============================== */

function renderTasks(tasksToRender = tasks) {
  tasksContainer.innerHTML = "";

  tasksToRender.forEach((task) => {
    const taskElement = document.createElement("div");

    // Completed task styling
    if (task.completed) {
      taskElement.style.backgroundColor = "#10b9819a";
      taskElement.style.borderRadius = "5px";
      taskElement.style.padding = "10px";
      taskElement.style.marginBottom = "20px";
      taskElement.style.boxShadow =
        "0 0 0 3px rgba(16, 185, 129, 0.15)";
    }

    // Task text
    const taskText = document.createElement("p");

    taskText.textContent = [
      task.title,
      task.description,
      task.date
    ].filter(Boolean).join(" ");

    // Buttons
    const but_delete = document.createElement("button");
    but_delete.classList.add("delete-btn");
    but_delete.textContent = "Remove";

    const but_complete = document.createElement("button");
    but_complete.classList.add("complete-btn");
    but_complete.textContent = task.completed
      ? "Undo"
      : "Complete";

    const but_edit = document.createElement("button");
    but_edit.classList.add("edit-btn");
    but_edit.textContent = "Edit";

    /* ==============================
       Complete / Undo
    ============================== */

    but_complete.addEventListener("click", () => {
      task.completed = !task.completed;

      saveTasks();
      applyFilters();
    });

    /* ==============================
       Remove Task
    ============================== */

    but_delete.addEventListener("click", () => {
      const originalIndex = tasks.indexOf(task);

      if (originalIndex !== -1) {
        tasks.splice(originalIndex, 1);
      }

      saveTasks();
      applyFilters();
    });

    /* ==============================
       Open Edit Modal
    ============================== */

    but_edit.addEventListener("click", () => {
      editingTask = task;

      editTitle.value = task.title;
      editDescription.value = task.description || "";
      editDate.value = task.date || "";

      editModal.style.display = "flex";
    });

    /* ==============================
       Add elements to page
    ============================== */

    taskElement.appendChild(taskText);

    // Button order: Complete, Edit, Remove
    taskElement.appendChild(but_complete);
    taskElement.appendChild(but_edit);
    taskElement.appendChild(but_delete);

    tasksContainer.appendChild(taskElement);
  });

  // Empty message
  if (tasksToRender.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

/* ==============================
   5. Add New Task
============================== */

addform.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titletask.value.trim();
  const description = titleDescription.value.trim();
  const date = taskDate.value;

  // Title is required
  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  const newTask = {
    title: title,
    description: description,
    date: date,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();

  addform.reset();

  applyFilters();
});

/* ==============================
   6. Save Edited Task
============================== */

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editingTask === null) {
    return;
  }

  const title = editTitle.value.trim();
  const description = editDescription.value.trim();
  const date = editDate.value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  editingTask.title = title;
  editingTask.description = description;
  editingTask.date = date;

  saveTasks();

  editModal.style.display = "none";
  editingTask = null;

  editForm.reset();

  applyFilters();
});

/* ==============================
   7. Cancel Editing
============================== */

function cancelTask() {
  editingTask = null;
  editModal.style.display = "none";
  editForm.reset();
}

cancelEdit.addEventListener("click", () => {
  cancelTask();
});

/* ==============================
   8. Search and Filters
============================== */

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  let filteredTasks = tasks;

  // Filter by status
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  // Search by title
  if (searchTerm !== "") {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm)
    );
  }

  renderTasks(filteredTasks);
}

/* Search input */

searchInput.addEventListener("input", () => {
  applyFilters();
});

/* Filter buttons */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.getAttribute("data-filter");

    applyFilters();
  });
});

/* ==============================
   9. Initial Render
============================== */

applyFilters();
