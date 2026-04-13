
const API_URL = 'http://localhost:3000/api/tasks';

// CORS = Cross-Origin Resource Sharing

let toDoList = [];

// Fetch tasks from the API
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        toDoList = data;
        console.log('Fetched tasks:', toDoList);
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

const renderTasks = () => {
    const tasksList = document.getElementById('tasks_list');
    tasksList.innerHTML = '';
    toDoList.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.priority}</td>
            <td>${task.isCompleted}</td>
            <td>
                <button class="btn btn-outline primary">Edit</button>
                <button class="btn btn-outline danger" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        tasksList.appendChild(row);
    });
}

// Send new task for saving API
const taskForm = document.getElementById('task_form');
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const priority = document.getElementById('priority').value;         
    
    const newTask = { 
        title,
        priority: priority
    };

    try {
        const response = await fetch(API_URL,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)   
        });
        if (response.ok) {
            fetchTasks();
            alert('Task created successfully!');
            taskForm.reset();
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
 });

 window.deleteTask = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTasks();
            alert('Task deleted successfully!');
        }
    } catch (error) {
        console.error('Error deleting task:', error.message);
    }
};

// Call to fetch function
fetchTasks();