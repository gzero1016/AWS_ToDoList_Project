const listOnClickHandle = () => {
    Routes.getInstance().routeState = "todolist";
    Routes.getInstance().show();
}

const calendarOnClickHandle = () => {
    Routes.getInstance().routeState = "calendar";
    Routes.getInstance().show();
    updateCalendarTodoList(calendarDate);
} 