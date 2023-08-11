const calendarBody = document.getElementById("calendar-body");
const monthDisplay = document.querySelector(".calendar-month");
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let calendarDate = new Date();  //현재 날짜 캘린터 기본값



//캘린더 표시 함수
function showCalendar() {
    const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const lastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
    
    calendarBody.innerHTML = "";
    
    let currentDate = new Date(firstDay);
    let weekRow = document.createElement("tr");
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("td"); //빈 셀 생성
        weekRow.appendChild(emptyCell);
    }
    
    while (currentDate <= lastDay) {
        const cell = document.createElement("td");  //날짜 셀 생성
        const content = document.createElement("div");
        const contentText = document.createElement("span");
        contentText.textContent = currentDate.getDate();
        
        if (isToday(currentDate)) {
            contentText.classList.add("today");
        }
        
        content.addEventListener("click", () => {
            // 작성자: junil
            // 날짜만 전달하는 것이 아닌 데이트타입 데이터 통으로 보내야함
            const newDate = new Date(`${calendarDate.getFullYear()}-${calendarDate.getMonth() + 1}-${parseInt(contentText.textContent)}`);
            handleDateClick(newDate);   //날짜 클릭 이벤트 처리
        });
        content.appendChild(contentText);
        cell.appendChild(content);
        weekRow.appendChild(cell);
        
        if (currentDate.getDay() === 6 || currentDate.getTime() === lastDay.getTime()) {
            calendarBody.appendChild(weekRow);
            weekRow = document.createElement("tr");
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const monthName = monthNames[calendarDate.getMonth()];
    
    monthDisplay.textContent = `${monthName} ${calendarDate.getFullYear()}`;

    // 작성자: junil
    //페이지가 로드되었을 때 현재 날짜 기준 todolist표시
    updateCalendarTodoList(calendarDate);
    //////////////////////////////////////////////////////
}

//오늘날짜 확인
function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

// 작성자: junil
/////이거 왜 두개냐!!!

// 캘린더 초기화 시 오늘 날짜와 요일 표시
const todayWeekdayName = weekdayNames[new Date().getDay()];
const todayDate = new Date().getDate();
const clickedWeekdayDisplay = document.querySelector(".calendar-m");
const clickedDateDisplay = document.querySelector(".calendar-day");
clickedWeekdayDisplay.textContent = todayWeekdayName;
clickedDateDisplay.textContent = `${todayDate}`;

// 캘린더 초기화
showCalendar();

// 날짜 클릭 이벤트 처리
function handleDateClick(date) {
    const calendarPageContainer = document.querySelector(".calendar-page-container");
    const clickedWeekdayDisplay = document.querySelector(".calendar-m");
    const clickedDateDisplay = document.querySelector(".calendar-day");

    // 작성자: junil
    // 클릭된 데이트 기준으로 다시 todolist업데이트
    updateCalendarTodoList(date);
    
    // 캘린더 사이드바가 열려있지 않거나 선택한 날짜가 이전 선택과 다를 경우 처리
    if (!calendarPageContainer.classList.contains("isToDoListSidebarOpen") || clickedDateDisplay.textContent !== /*작성자: junil 데이트 타입이기 때문에 날짜 가지고 오는 getDate() 필요*/`${date.getDate()}일`) {
        const year = calendarDate.getFullYear();
        const monthName = monthNames[calendarDate.getMonth()];
        const day = /*작성자: junil 데이트 타입이기 때문에 날짜 가지고 오는 getDate() 필요*/date.getDate();

        const clickedDate = new Date(year, calendarDate.getMonth(), day);
        const weekdayName = weekdayNames[clickedDate.getDay()];
        
        clickedWeekdayDisplay.textContent = `${weekdayName}`;
        clickedDateDisplay.textContent = `${day}`;

        calendarPageContainer.classList.add("isToDoListSidebarOpen");

        generateTodoObj(year, monthName, day);   // 선택한 날짜에 따른 ToDo 생성
    }
    // 작성자: junil
    // 이건 todolist페이지에서 update하는 메소드임.
    TodoListService.getInstance().updateTodoList();
}

// 작성자: junil
// 해당 날짜의 todo를 list로뿌려주는 메소드
function updateCalendarTodoList(date) {
    const todolistCalendarContainer = document.querySelector(".todolist-calendar-container");
    
    // todolist에서 해당 날짜와 일치하는 todo만 필터링해서 li태그로 변환후 렌더링해줌.
    todolistCalendarContainer.innerHTML = TodoListService.getInstance().todoList.filter(todo => todo.createDate == DateUtils.toStringByFormatting(date)).map(todo => {
        return `<li>${todo.todoContent}</li>`
    });
}

// 이전 달로 이동하는 함수
function beforeMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, calendarDate.getDate());
    showCalendar();
}

document.getElementById("beforebtn").addEventListener("click", beforeMonth);

// 다음 달로 이동하는 함수
function nextMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, calendarDate.getDate());
    showCalendar();
}

document.getElementById("nextbtn").addEventListener("click", nextMonth);

showCalendar();

// 오늘날짜로 초기화
function initializeCalendar() {
    const today = new Date();
    const todayWeekdayName = weekdayNames[today.getDay()];
    const todayDate = today.getDate();

    clickedWeekdayDisplay.textContent = todayWeekdayName;
    clickedDateDisplay.textContent = `${todayDate}`;
}