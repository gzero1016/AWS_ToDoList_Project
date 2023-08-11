const sidebarToggleButtonOnClickHandle = () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggleButton = document.querySelector(".sidebar-toggle-button");

    if(sidebar.classList.contains("isSidebarOpen")) {
        sidebar.classList.remove("isSidebarOpen");
    }else {
        sidebar.classList.add("isSidebarOpen");
    }
}

const sidebarMenuOnClickHandle = (target) => {
    switch(target.innerHTML) {
        case "Main": 
            Routes.getInstance().routeState = "welcome";
            break;
        case "ToDoList":
            Routes.getInstance().routeState = "todolist";
            filterTodoList(null);
            break;
        case "Calendar":
            Routes.getInstance().routeState = "calendar";
            initializeCalendar();
        break;
    }

    Routes.getInstance().show();
    sidebarToggleButtonOnClickHandle();
    updateCalendarTodoList(calendarDate);   
}