const openModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.remove("invisible");
}


const closeModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.add("invisible");
    modal.innerHTML = "";
}

const modifySubmitButtonOnClick = (id, filterStatus) => {
    const newTodoContent = document.querySelector(".modal-main .w-f").value;
    const todo = TodoListService.getInstance().getTodoById(id);
    if (todo.todoContent === newTodoContent || !newTodoContent) {
        closeModal();
        return;
    }
    const todoObj = {
        ...todo,
        todoContent: newTodoContent
    }
    TodoListService.getInstance().setTodo(todoObj);
    statusDropdownOnChangeHandle(filterStatus);
    closeModal();
}

const modifyModal = (todo) => {
    const modal = document.querySelector(".modal");
    modal.innerHTML = `
        <div class="modal-container">
            <header class="modal-header">
                <h1 class="modal-title">
                    ToDo modification
                </h1>
            </header>
            <main class="modal-main">
                <p class="modal-message">
                    수정해주세요.
                </p>
                <input type="text" class="w-f" value="${todo.todoContent}">
            </main>
            <footer class="modal-footer">
            <button class="btn" onclick="modifySubmitButtonOnClick(${todo.id}); closeModal();">확인</button>
            <button class="btn" onclick="closeModal();">닫기</button>
            </footer>
        </div>
    `;
    const submitButton = modal.querySelector(".btn");
    submitButton.addEventListener("click", () => {
        modifySubmitButtonOnClick(todo.id, currentFilterStatus);
        closeModal();
    });
}