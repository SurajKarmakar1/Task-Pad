document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");
  const emptyState = document.getElementById("empty-state");
  const themeToggle = document.getElementById("theme-toggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Theme management
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Initialize tasks
  tasks.forEach((task) => renderTasks(task));
  updateEmptyState();

  // Add task on button click
  addTaskButton.addEventListener("click", addTask);

  // Add task on Enter key
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      isCompleted: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks(newTask);
    todoInput.value = "";
    updateEmptyState();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateEmptyState() {
    const brandSection = document.querySelector(
      ".flex.items-center.gap-3.mb-6"
    );

    if (tasks.length === 0) {
      emptyState.classList.remove("hidden");
      brandSection.classList.add("hidden"); // Hide brand when showing empty state
    } else {
      emptyState.classList.add("hidden");
      brandSection.classList.remove("hidden"); // Show brand when there are tasks
    }
  }

  function renderTasks(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    const completedClasses = task.isCompleted
      ? "line-through text-slate-500 dark:text-slate-400"
      : "text-black dark:text-white";

    li.className =
      "group flex items-center justify-between py-3 px-3 -mx-3 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors";

    li.innerHTML = `
      <div class="flex items-center gap-3 flex-1 cursor-pointer">
        <div class="flex-shrink-0">
          ${
            task.isCompleted
              ? `<div class="h-4 w-4 border border-black dark:border-white bg-black dark:bg-white flex items-center justify-center">
                   <svg class="h-3 w-3 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                   </svg>
                 </div>`
              : `<div class="h-4 w-4 border border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors"></div>`
          }
        </div>
        <span class="flex-1 text-sm font-medium ${completedClasses} transition-colors">${
      task.text
    }</span>
      </div>
      <button class="opacity-0 group-hover:opacity-100 h-8 w-8 inline-flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-all" title="Delete">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;

    // Toggle completion when clicking the task area
    const taskArea = li.querySelector(".flex.items-center.gap-3");
    taskArea.addEventListener("click", (e) => {
      task.isCompleted = !task.isCompleted;
      saveTasks();

      // Update the task display
      li.remove();
      renderTasks(task);
    });

    // Delete task
    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();

      // Add fade out animation
      li.style.transform = "translateX(100%)";
      li.style.opacity = "0";

      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        li.remove();
        updateEmptyState();
      }, 200);
    });

    // Add slide-in animation for new tasks
    li.style.transform = "translateY(-10px)";
    li.style.opacity = "0";
    todoList.appendChild(li);

    // Trigger animation
    setTimeout(() => {
      li.style.transform = "translateY(0)";
      li.style.opacity = "1";
      li.style.transition = "all 0.3s ease-out";
    }, 10);
  }
});
