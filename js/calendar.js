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
            contentText.classList.add("today");
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
    
    const monthName = monthNames[calendarDate.getMonth()];
    
    monthDisplay.textContent = `${monthName} ${calendarDate.getFullYear()}`;
}


function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

function handleDateClick(date) {

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

function filterTodoListForSelectedDate(selectedDate) {
    const selectedWeekday = selectedDate.getDay();
    const tempArray = TodoListService.getInstance().todoList.filter((todo) => {
        const todoDate = new Date(todo.createDate);
        return todoDate.getDay() === selectedWeekday;
    });

    TodoListService.getInstance().updateTodoList(tempArray);
}

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
        const weekdayName = weekdayNames[clickedDate.getDay()];
        
        clickedWeekdayDisplay.textContent = `${weekdayName}`;
        clickedDateDisplay.textContent = `${day}`;

        calendarPageContainer.classList.add("isToDoListSidebarOpen");

        generateTodoObj(year, monthName, day);
    

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