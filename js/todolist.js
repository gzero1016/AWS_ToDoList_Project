// 버튼 클릭 이벤트 핸들러
const addTodoButtonOnClickHandle = () => {
    generateTodoObj();
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
    filterTodoList(currentFilterStatus);  // 선택된 필터링 상태로 Todo 리스트를 필터링하여 업데이트
}

// 체크박스 변경 이벤트 핸들러
const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompleStatus(target.value, target.checked);
}

// "수정" 버튼 클릭 이벤트 핸들러
const modifyTodoOnClickHandle = (target, filterStatus) => {
    openModal();    //모달열기
    // 선택된 Todo 정보로 모달 수정 폼을 업데이트
    modifyModal(TodoListService.getInstance().getTodoById(target.value), filterStatus); 
}

// "삭제" 버튼 클릭 이벤트 핸들러
const deleteTodoOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value); // 선택된 Todo 삭제
}

// "Add Todo" 버튼 클릭 시 Todo를 생성하는 함수
const generateTodoObj = () => {
    const inputText = document.querySelector(".text-input").value;

    if (inputText === "") {
        return;
    }

    // 캘린더에서 선택한 날짜 정보 가져오기
    const clickedMonthDisplay = document.querySelector(".calendar-month");
    const clickedDateDisplay = document.querySelector(".calendar-day");
    const todoDate = DateUtils.getDateFromCalendarElements(clickedMonthDisplay, clickedDateDisplay);
    const todoDateString = DateUtils.toStringByFormatting(todoDate);

    // Todo 객체 생성
    const todoObj = {
        id: 0,   // 아이디는 TodoListService에서 처리
        todoContent: inputText,
        createDate: todoDateString,
        completStatus: false
    };

    // TodoListService를 이용하여 Todo 추가
    TodoListService.getInstance().addTodo(todoObj); 

    // 입력 필드 초기화
    document.querySelector(".text-input").value = "";
}

// 검색 결과를 필터링하여 업데이트
function filterTodoList(completStatus) {
    let tempArray = [];
    
    if (completStatus === null) {
        tempArray = TodoListService.getInstance().todoList; // 선택된 필터가 "전체"면 전체 리스트를 보여줌
    } else {
        tempArray = TodoListService.getInstance().todoList.filter((todo) => {
            return todo.completStatus === completStatus;     // 선택된 필터링 상태에 따라 필터링된 Todo 리스트를 보여줌
        });
    }

    TodoListService.getInstance().updateTodoList(tempArray);     // 업데이트된 Todo 리스트를 출력
}

// Todo 리스트 관리 서비스 클래스
class TodoListService {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null) {
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }

    // Todo 리스트와 인덱스 초기화
    todoList = new Array();
    todoIndex = 1;

    constructor() {
        this.loadTodoList();
    }

     // 로컬 스토리지에서 Todo 리스트 로드
    loadTodoList() {
        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array();
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1 : 1;
    }

    // 로컬 스토리지에 Todo 리스트 저장
    saveLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    // 아이디로 Todo 가져오기
    getTodoById(id) {
        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    // Todo 추가
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

    // 완료 상태 업데이트
    setCompleStatus(id, status) {
        this.todoList.forEach((todo, index) => {
            if(todo.id === parseInt(id)) {
                this.todoList[index].completStatus = status;
            }
        });

        this.saveLocalStorage();
    }

    // Todo 업데이트
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

    // Todo 삭제
    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);
        });

        this.saveLocalStorage();
        this.updateTodoList();
    }

        // Todo 리스트 업데이트
    updateTodoList(filteredList = null) {
        const todoListToShow = filteredList || this.todoList;
        const todolistMainContainer = document.querySelector(".todolist-main-container");
        console.log(todolistMainContainer);
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