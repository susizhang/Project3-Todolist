const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");

// Event Listeners

toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deletecheck);
// to load the saved todo list
document.addEventListener("DOMContentLoaded", getTodos);

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// Functions;
function addToDo(event) {
  // Prevents form from submitting / Prevents form from reloading;
  event.preventDefault();

  if (toDoInput.value === "") {
    alert("You must write something!");
  } else {
    //toDoDIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo");

    // Create LI
    const newToDo = document.createElement("li");

    // newToDo.innerText = "hey";
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    // Adding to local storage;
    savelocal(toDoInput.value);

    // check btn;
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    toDoDiv.appendChild(checked);
    // delete btn;
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    toDoDiv.appendChild(deleted);

    newToDo.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.value = toDoDiv.innerText;
      editInput.classList.add("editInput");
      editInput.addEventListener("blur", () => {
        newToDo.innerText = editInput.value;
        newToDo.style.display = "list-item";
        toDoDiv.removeChild(editInput);
        updateLocalTodo(editInput.value, index);
      });
      toDoDiv.insertBefore(editInput, checked);
      newToDo.style.display = "none";
      editInput.focus();
    });

    // Append to list;
    toDoList.appendChild(toDoDiv);

    // CLearing the input;
    toDoInput.value = "";
  }
}

function deletecheck(event) {
  // console.log(event.target);
  const item = event.target;

  // delete
  if (item.classList[0] === "delete-btn") {
    // item.parentElement.remove();
    // animation
    item.parentElement.classList.add("fall");

    // Immediately delete

    // item.parentElement.remove();

    //removing local todos;
    removeLocalTodos(item.parentElement);

    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });
  }

  // check
  if (item.classList[0] === "check-btn") {
    item.parentElement.classList.toggle("completed");
  }
}

// Saving to local storage:
function savelocal(todo) {
  //Check: if item/s are there;
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  //Check: if item/s are there;
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo, index) {
    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement("li");

    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    // check btn;
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    toDoDiv.appendChild(checked);
    // delete btn;
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    toDoDiv.appendChild(deleted);

    newToDo.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.value = toDoDiv.innerText;
      editInput.classList.add("editInput");
      editInput.addEventListener("blur", () => {
        newToDo.innerText = editInput.value;
        newToDo.style.display = "list-item";
        toDoDiv.removeChild(editInput);
        updateLocalTodo(editInput.value, index);
      });
      toDoDiv.insertBefore(editInput, checked);
      newToDo.style.display = "none";
      editInput.focus();
    });

    // Append to list;
    toDoList.appendChild(toDoDiv);
  });
}

function updateLocalTodo(todo, index) {
  //Check: if item/s are there;
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos[index] = todo;
  // console.log(todos);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
  //Check: if item/s are there;
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todos.indexOf(todo.children[0].innerText);
  // console.log(todoIndex);
  todos.splice(todoIndex, 1);
  // console.log(todos);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");

  document.body.className = color;
  // Change blinking cursor for darker theme:
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").className = `${color}-input`;
  // Change todo color without changing their status (completed or not):
  document.querySelectorAll(".todo").forEach((todo) => {
    Array.from(todo.classList).some((item) => item === "completed")
      ? (todo.className = `todo ${color}-todo completed`)
      : (todo.className = `todo ${color}-todo`);
  });
  // Change buttons color according to their type (todo, check or delete):
  document.querySelectorAll("button").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.className = `check-btn ${color}-button`;
      } else if (item === "delete-btn") {
        button.className = `delete-btn ${color}-button`;
      } else if (item === "todo-btn") {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}
