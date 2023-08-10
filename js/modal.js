// 모달을 열기 위한 함수
const openModal = () => {
    const modal = document.querySelector(".modal"); // 모달 요소 가져오기
    modal.classList.remove("invisible"); // 모달이 보이도록 "invisible" 클래스 제거
}

// 모달을 닫기 위한 함수
const closeModal = () => {
    const modal = document.querySelector(".modal"); // 모달 요소 가져오기
    modal.classList.add("invisible"); // 모달을 숨기도록 "invisible" 클래스 추가
    modal.innerHTML = ""; // 모달 내용 초기화
}

// 수정 모달에서 "확인" 버튼을 클릭했을 때 호출되는 함수
const modifySubmitButtonOnClick = (id, filterStatus) => {
    // 수정된 내용을 가져오기
    const newTodoContent = document.querySelector(".modal-main .w-f").value;
    const todo = TodoListService.getInstance().getTodoById(id); // 해당 ToDo 정보 가져오기

    // 수정된 내용이 변경되지 않았거나 비어있으면 모달 닫기
    if (todo.todoContent === newTodoContent || !newTodoContent) {
        closeModal();
        return;
    }

    // ToDo 항목 수정
    const todoObj = {
        ...todo,
        todoContent: newTodoContent
    }
    TodoListService.getInstance().setTodo(todoObj); // 수정된 ToDo 항목 저장

    statusDropdownOnChangeHandle(filterStatus); // 필터링된 ToDo 목록 갱신
    closeModal();
}

// ToDo 항목을 수정하는 모달 생성 및 표시
const modifyModal = (todo) => {
    const modal = document.querySelector(".modal"); // 모달 요소 가져오기
    modal.innerHTML = `
        <!-- 모달 컨테이너 -->
        <div class="modal-container">
            <!-- 모달 헤더 -->
            <header class="modal-header">
                <h1 class="modal-title">
                    ToDo modification
                </h1>
            </header>
            <!-- 모달 메인 내용 -->
            <main class="modal-main">
                <p class="modal-message">
                    수정해주세요.
                </p>
                <!-- 수정 내용 입력 필드 -->
                <input type="text" class="w-f" value="${todo.todoContent}">
            </main>
            <!-- 모달 하단 버튼 -->
            <footer class="modal-footer">
                <!-- "확인" 버튼: 수정 내용 저장 및 모달 닫기 -->
                <button class="btn" onclick="modifySubmitButtonOnClick(${todo.id}); closeModal();">확인</button>
                <!-- "닫기" 버튼: 모달 닫기 -->
                <button class="btn" onclick="closeModal();">닫기</button>
            </footer>
        </div>
    `;

    const submitButton = modal.querySelector(".btn");
    submitButton.addEventListener("click", () => {

        // "확인" 버튼 클릭 시 수정 내용 저장 및 모달 닫기
        modifySubmitButtonOnClick(todo.id, currentFilterStatus);
        closeModal();
    });
}