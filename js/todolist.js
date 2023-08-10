const addTodoButtonOnClickHandle = () => {
    generateTodoObj();
}

const addTodoOnKeyUpHandle = (event) => {
    if(event.keyCode === 13) {
        generateTodoObj();
    }
}

// 드롭다운 박스의 옵션 값을 읽어와서 필터링하는 함수
const statusDropdown = document.querySelector("#status-dropdown");
const statusDropdownOnChangeHandle = () => {
    const selectedStatus = statusDropdown.options[statusDropdown.selectedIndex].value;

    let statusValue;
    switch (selectedStatus) {
        case "전체":
            statusValue = null;
            break;
        case "진행중":
            statusValue = false;
            break;
        case "완료":
            statusValue = true;
            break;
        default:
            statusValue = null;
            break;
    }

    currentFilterStatus = statusValue;
    filterTodoList(currentFilterStatus);
}

const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompleStatus(target.value, target.checked);
}

const modifyTodoOnClickHandle = (target, filterStatus) => {
    openModal();
    modifyModal(TodoListService.getInstance().getTodoById(target.value), filterStatus);
}

const deleteTodoOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value);
}

const generateTodoObj = () => {
    const todoContent = document.querySelector(".calendar-page-left .text-input").value;

    const todoObj = {
        id: 0,
        todoContent: todoContent,
        createDate: DateUtils.toStringByFormatting(new Date()),
        completStatus: false
    };

    TodoListService.getInstance().addTodo(todoObj);
}

// 검색 결과를 필터링하여 업데이트
function filterTodoList(completStatus) {
    let tempArray = [];
    
    if (completStatus === null) {
        tempArray = TodoListService.getInstance().todoList;
    } else {
        tempArray = TodoListService.getInstance().todoList.filter((todo) => {
            return todo.completStatus === completStatus;
        });
    }

    TodoListService.getInstance().updateTodoList(tempArray);
}

class TodoListService {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null) {
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }

    todoList = new Array();
    todoIndex = 1;

    constructor() {
        this.loadTodoList();
    }

    loadTodoList() {
        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array();
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1 : 1;
    }

    saveLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    getTodoById(id) {
        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    addTodo(todoObj) {
        const todo = {
            ...todoObj,
            id: this.todoIndex
        }

        this.todoList.push(todo);

        this.saveLocalStorage();

        this.updateTodoList();

        this.todoIndex++;
    }

    setCompleStatus(id, status) {
        this.todoList.forEach((todo, index) => {
            if(todo.id === parseInt(id)) {
                this.todoList[index].completStatus = status;
            }
        });

        this.saveLocalStorage();
    }

    setTodo(todoObj) {
        for(let i = 0; i < this.todoList.length; i++) {
            if(this.todoList[i].id === todoObj.id) {
                this.todoList[i] = todoObj;
                break;
            }
        }

        this.saveLocalStorage();

        this.updateTodoList();
    }

    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);
        });

        this.saveLocalStorage();
        this.updateTodoList();
    }

updateTodoList(filteredList = null) {
    const todoListToShow = filteredList || this.todoList;
    const todolistMainContainer = document.querySelector(".todolist-main-container");

    todolistMainContainer.innerHTML = todoListToShow.map(todo => {
            return `
                <li class="todolist-items">
                    <div class="item-left">
                        <input type="checkbox" id="complet-chkbox${todo.id}" class="complet-chkboxs" ${todo.completStatus ? "checked" : ""} value="${todo.id}" onchange="checkedOnChangeHandle(this);">
                        <label for="complet-chkbox${todo.id}"></label>
                    </div>
                    <div class="item-center">
                        <pre class="todolist-content">${todo.todoContent}</pre>
                    </div>
                    <div class="item-right">
                        <p class="todolist-date">${todo.createDate}</p>
                        <div class="todolist-item-buttons">
                            <button class="btn btn-edit" value="${todo.id}" onclick="modifyTodoOnClickHandle(this);">수정</button>
                            <button class="btn btn-remove" value="${todo.id}" onclick="deleteTodoOnClickHandle(this);">삭제</button>
                        </div>
                    </div>
                </li>
            `;
        }).join("");
    }
}