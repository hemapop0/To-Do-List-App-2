
const tasks = [];

const editModal = document.getElementById("edit-modal");
const addform = document.getElementById("sec02__form");
const titletask = document.getElementById("Title__task");
const titleDescription = document.getElementById("Title__des");
const tasksContainer = document.getElementById("task__list");
const emptyMessage = document.getElementById("empty-message");
const taskDate = document.getElementById("Title__date");

const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("edit-title");
const editDescription = document.getElementById("edit-description");
const editDate = document.getElementById("edit-date");
const cancelEdit = document.getElementById("cancel-edit");
const saveEdit = document.getElementById("save-edit");


const searchInput = document.getElementById("search__input");



const filterButtons  = document.querySelectorAll(".filter-btn");

let currentFilter = "all";



/* ده متغير هنخزّن فيه رقم المهمة اللي بنعدّلها.
- -1 معناها إننا لسه مختارناش مهمة للتعديل.
- لو ضغطنا Edit على المهمة رقم 2، هنخزّن الرقم 2 فيه. */
let editingTask = null;




// عرض المهام
function renderTasks(tasksToRender = tasks) {
  tasksContainer.innerHTML = "";

  tasksToRender.forEach((task, index) => {
    const taskElement = document.createElement("div");
    if (task.completed) {
    taskElement.style.backgroundColor = "#10b9819a";
    taskElement.style.borderRadius = "5px";
    taskElement.style.padding = "10px";
    taskElement.style.marginBottom = "20px";
    taskElement.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.15)";
    
}
    const taskText = document.createElement("p");
    const but_delete = document.createElement("button");
    but_delete.classList.add("delete-btn");
    const but_complete = document.createElement("button");
    but_complete.classList.add("complete-btn");

    const but_edit = document.createElement("button");
    but_edit.classList.add("edit-btn");
  


    taskText.textContent =
      task.title + " " +
      task.description + " " +
      task.date;

    but_delete.textContent = "Remove";
    but_complete.textContent = "Complete";
    but_edit.textContent = "Edit";


    but_complete.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTasks(tasksToRender);
    });

    but_delete.addEventListener("click", () => {
  const originalIndex = tasks.indexOf(task);

  if (originalIndex !== -1) {
    tasks.splice(originalIndex, 1);
  }

  renderTasks(tasks);
});

    but_edit.addEventListener("click", () => {
      // إظهار الموديل
      editModal.style.display = "flex";

     editingTask = task;
      // تعيين editTitle.value = task.title;
      editTitle.value = task.title;
      editDescription.value = task.description;
      editDate.value = task.date;

      


      
     
    });
    taskElement.appendChild(taskText);
    taskElement.appendChild(but_complete);
    taskElement.appendChild(but_delete); 
    taskElement.appendChild(but_edit);
    
    tasksContainer.appendChild(taskElement);
  });

  if (tasksToRender.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        Savetasks();
    });

/* Button Save */
function Savetasks(){
  if(editingTask === null){
    return;
  }
  const title =editTitle.value.trim();
  const description =editDescription.value.trim();
  const date =editDate.value;

  if (title === "" || description === "") {
    return;
  }
 

 

  editingTask.title = title;
  editingTask.description = description;
  editingTask.date = date;

  renderTasks(tasks);

  editModal.style.display = "none";
  editingTask = null;
  editForm.reset();

}
      /* Function Cancel */
  function cancelTask(){
    editingTask = null;
    editModal.style.display = "none";
    editForm.reset();
  }
      /* Button Cancel */
      cancelEdit.textContent = "Cancel";
      cancelEdit.addEventListener("click", () => {
        cancelTask();
      });



// إضافة مهمة
addform.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titletask.value.trim();
  
  /* التحقق من أن المهمة غير فارغة  */
  if (title === "") {
    return;
}


/* للبحث عن المهمة   title */





  const description = titleDescription.value.trim();
  const date = taskDate.value;
  if (description === "") {
    return;
  }

  tasks.push({
    title: title,
    description: description,
    date: date,
    completed: false,
  });

  renderTasks();

  titletask.value = "";
  titleDescription.value = "";
  taskDate.value = "";

});


/* هنا */
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();
  
const filteredTasks = tasks.filter((task) =>
  task.title.toLowerCase().includes(searchTerm.toLowerCase())
);
applyFilters();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.getAttribute("data-filter");
    applyFilters();
  });
});

function applyFilters(){
  let filteredTasks = tasks;
  const searchTerm = searchInput.value.trim();

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (searchTerm !== "") {
  // هنا هنفلتر filteredTasks حسب عنوان المهمة
  filteredTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
  renderTasks(filteredTasks);
}


// إظهار رسالة القائمة الفارغة عند فتح الصفحة
renderTasks();
