import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addBtnEl = document.querySelector('#add-btn');
  }

  getDeleteButtons() {
    return document.querySelectorAll('.trash-icon');
  }

  addTask(task) {
    this.$addBtnEl.textContent = 'Adding...';
    this.$addBtnEl.disabled = true;

    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
      })
      .then(() => this.handleDeleteTask());

    this.$addBtnEl.textContent = 'Add Task';
    this.$addBtnEl.disabled = false;
  }

  addTaskToTable(task) {
    const { id, title } = task;
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${id}</th><td>${title}</td>
    <td><button id=${id} class="trash-icon"><i class="far fa-trash-alt"></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi()
      .then((currentTasks) => {
        currentTasks.forEach((task, index) => {
          this.addTaskToTable(task, index + 1);
        });
      })
      .then(() => this.handleDeleteTask());
  }

  deleteTaskFromTable(element) {
    const parentEl = element.parentElement.parentElement;
    parentEl.remove(element);
  }

  handleDeleteTask() {
    const deleteBtns = this.getDeleteButtons();
    deleteBtns.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget;
        deleteTaskFromApi(target.id)
          .then((element) => {
            this.deleteTaskFromTable(target);
          })
          .catch((error) => alert(error));
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
