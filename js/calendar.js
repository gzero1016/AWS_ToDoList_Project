const calendarBody = document.getElementById("calendar-body");
const monthDisplay = document.querySelector(".calendar-month");
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let calendarDate = new Date();

function showCalendar() {
    const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const lastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
    
    calendarBody.innerHTML = "";
    
    let currentDate = new Date(firstDay);
    let weekRow = document.createElement("tr");
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("td");
        weekRow.appendChild(emptyCell);
    }
    
    while (currentDate <= lastDay) {
        const cell = document.createElement("td");
        const content = document.createElement("div");
        const contentText = document.createElement("span");
        contentText.textContent = currentDate.getDate();
        
        if (isToday(currentDate)) {
            contentText.classList.add("today"); // 특정 클래스 추가
        }
        
        contentText.addEventListener("click", () => {
            handleDateClick(contentText.textContent);
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
    
    const monthName = monthNames[calendarDate.getMonth()]; // 월 이름 가져오기
    
    monthDisplay.textContent = `${monthName} ${calendarDate.getFullYear()}`;
}


function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

function handleDateClick(date) {
    // handleDateClick 함수 내용은 이전과 동일하게 유지

    TodoListService.getInstance().updateTodoList();
}

// 최초로 캘린더를 초기화할 때, 오늘 날짜와 요일을 표시
const todayWeekdayName = weekdayNames[new Date().getDay()];
const todayDate = new Date().getDate();
const clickedWeekdayDisplay = document.querySelector(".calendar-m");
const clickedDateDisplay = document.querySelector(".calendar-day");
clickedWeekdayDisplay.textContent = todayWeekdayName;
clickedDateDisplay.textContent = `${todayDate}`;

// 캘린더 초기화
showCalendar();

function handleDateClick(date) {
    let clickedDateInfo = null;

    const calendarPageContainer = document.querySelector(".calendar-page-container");
    const mainContainer = document.querySelector(".main-container");
    
    const clickedWeekdayDisplay = document.querySelector(".calendar-m");
    const clickedDateDisplay = document.querySelector(".calendar-day");
    
    if (!calendarPageContainer.classList.contains("isToDoListSidebarOpen") || clickedDateDisplay.textContent !== `${date}일`) {
        const year = calendarDate.getFullYear();
        const monthName = monthNames[calendarDate.getMonth()];
        const day = date;

        const clickedDate = new Date(year, calendarDate.getMonth(), day);
        const weekdayName = weekdayNames[clickedDate.getDay()]; // 선택한 날짜의 영어 요일 이름
        
        clickedWeekdayDisplay.textContent = `${weekdayName}`;
        clickedDateDisplay.textContent = `${day}`;

        clickedDateInfo = {
            year: calendarDate.getFullYear(),
            month: calendarDate.getMonth() + 1,
            day: day
        };
        
        calendarPageContainer.classList.add("isToDoListSidebarOpen");
    }

    TodoListService.getInstance().updateTodoList();
}

function beforeMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, calendarDate.getDate());
    showCalendar();
}

function nextMonth() {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, calendarDate.getDate());
    showCalendar();
}

document.getElementById("beforebtn").addEventListener("click", beforeMonth);

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

