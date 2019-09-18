class Vista {
 constructor() {
   this.app = this.getElement("#root");

   this.title = this.createElement("h1");
   this.title.textContent = "To Do List";

   this.form = this.createElement("form");

   this.input = this.createElement("input");
   this.input.type = "text";
   this.input.placeholder = "Add To Do";
   this.input.name = "todo";

   this.submitButton = this.createElement("button");
   this.submitButton.textContent = "Submit";

   this.toDoList = this.createElement("ul", "todo-list");

   this.form.append(this.input, this.submitButton);
   this.app.append(this.title, this.form, this.toDoList);
 }

 createElement(tag, className) {
   const element = document.createElement(tag);
   if (className) {
     element.classList.add(className);
   }

   return element;
 }

 getElement(selector) {
   const element = document.querySelector(selector);
   return element;
 }

 get _todoText() {
   return this.input.value;
 }

 _resetInput() {
   this.input.value = '';
 }

 displayTodos(todos) {
   while(this.toDoList.firstChild) {
     this.toDoList.removeChild(this.toDoList.firstChild)
   }

   if (todos.length === 0) {
     const p = this.createElement('p');
     p.textContent = 'Nothing to do! Add a Task!';
     this.toDoList.append(p);
   } else {
      const that = this;

      todos.forEach(function (todo) {
        const li = that.createElement('li');
        li.id = todo.id;

        const check = that.createElement('input');
        check.type = 'checkbox';
        check.checked = todo.complete;

        const span = that.createElement('span');
        span.contentEditable = true;
        span.classList.add('editable');

        const deleteButton = that.createElement('button');
        deleteButton.classList.add("delete");
        deleteButton.textContent = "Eliminar";

        if (todo.complete) {
          const strike = that.createElement('s');
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          span.textContent = todo.text;
        }

        li.append(check, span, deleteButton);

        that.toDoList.append(li);
      })
   }
 }

  // Event listener
  bindAddTodo(handler) {
    this.form.addEventListener("submit", function(event) {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    });
  }

  bindDeleteTodo = handler => {
    this.toDoList.addEventListener("click", event => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    })
  };

  bindToggleTodo = handler => {
    this.toDoList.addEventListener('change', event => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);


        handler(id);
      }
    });
  };
}

class Modelo {
 constructor() {
   this.toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
 }

 getId() {
   if (this.toDoList.length > 0) {
    return this.toDoList[this.toDoList.length - 1].id + 1
   }
   return 1;
 }

 _commit = todos => {
   this.onTodoListChanged(todos);

   localStorage.setItem('toDoList', JSON.stringify(todos));
 };

 addToDo(toDoText) {
   const todo = {
     id: this.getId(),
     text: toDoText,
     complete: false,
   };

   this.toDoList.push(todo);

   this._commit(this.toDoList);
 }

 deleteToDo(id) {
   this.toDoList = this.toDoList.filter(function(todo) {
     return todo.id !== id;
   });

   this._commit(this.toDoList);
 }

 toggleToDo(id) {
   this.toDoList = this.toDoList.map(function(todo) {
     return todo.id === id
       ? { id: todo.id, text: todo.text, complete: !todo.complete }
       : todo;
   });

   this._commit(this.toDoList);
 }

 bindTodoListChanged = callback => {
   this.onTodoListChanged = callback;
 }
}

class Controller {
 constructor(modelo, vista) {
   this.modelo = modelo;
   this.vista = vista;

   this.modelo.bindTodoListChanged(this.onTodoListChanged);

   this.vista.bindAddTodo(this.handlerAddTodo);
   this.vista.bindDeleteTodo(this.handlerDeleteTodo);
   this.vista.bindToggleTodo(this.handlerToggleTodo);

   this.onTodoListChanged(this.modelo.toDoList);
 }

 onTodoListChanged(todos) {
   this.vista.displayTodos(todos);
 }

  // Handlers
  handlerAddTodo(todoText) {
    this.modelo.addToDo(todoText);
  }

  handlerDeleteTodo(id) {
    this.modelo.deleteToDo(id);
  }

  handlerToggleTodo(id) {
    this.modelo.toggleToDo(id);
  }

}

const vista = new Vista();
const modelo = new Modelo();

const app = new Controller(modelo, vista);

app.modelo.addToDo("Hacer las compras");
