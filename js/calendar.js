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
        
        contentText.addEventListener("click", () => {
            handleDateClick(contentText.textContent);   //날짜 클릭 이벤트 처리
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
}

//오늘날짜 확인
function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

//날짜 클릭 이벤트 처리 함수
function handleDateClick(date) {

    TodoListService.getInstance().updateTodoList();
}

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
    let clickedDateInfo = null;

    const calendarPageContainer = document.querySelector(".calendar-page-container");
    const mainContainer = document.querySelector(".main-container");
    
    const clickedWeekdayDisplay = document.querySelector(".calendar-m");
    const clickedDateDisplay = document.querySelector(".calendar-day");
    
    // 캘린더 사이드바가 열려있지 않거나 선택한 날짜가 이전 선택과 다를 경우 처리
    if (!calendarPageContainer.classList.contains("isToDoListSidebarOpen") || clickedDateDisplay.textContent !== `${date}일`) {
        const year = calendarDate.getFullYear();
        const monthName = monthNames[calendarDate.getMonth()];
        const day = date;

        const clickedDate = new Date(year, calendarDate.getMonth(), day);
        const weekdayName = weekdayNames[clickedDate.getDay()];
        
        clickedWeekdayDisplay.textContent = `${weekdayName}`;
        clickedDateDisplay.textContent = `${day}`;

        calendarPageContainer.classList.add("isToDoListSidebarOpen");

        generateTodoObj(year, monthName, day);   // 선택한 날짜에 따른 ToDo 생성
    

    }
    TodoListService.getInstance().updateTodoList();
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