
const container = document.querySelector('.container')
const modalContainer = document.querySelector('.modalContainer')
const modalMain = document.querySelector('.modalMain')
const toDo = document.querySelector('.todo')
const done = document.querySelector('.done')
let previousToDoName = ''
let toDocontent = {}


const view = {
  renderAddModal () {
    modalMain.innerHTML = `
      <h3 class="modalTitle">Add ToDo</h3>
      <hr>
      <div class="modalInfo">
        <div class="toDoTitle">
          <label class="new-event">ToDo Topic</label>
          <input type="text" id="toDoTopic">
        </div>
        <div class="toDoContent">
          <label class="new-event-content">Details</label>
          <input type="text" id="toDoContent">
        </div>
        <div class="toDoDate">
          <label class="new-event-content">DeadLine</label>
          <input type="date" id="toDoDeadline">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="close btn btn-secondary">Close</button>
        <button type="button" class="save btn btn-primary">Save</button>
      </div>
    `
  },

  renderToDoList (toDoName) {
    let Topic = toDocontent[toDoName]['topic']
    let Text = toDocontent[toDoName]['content']
    let Deadline = toDocontent[toDoName]['date']
    toDo.innerHTML += `
    <div class="todo-sub-container row" id="todo${toDoName}">
      <div class="accordion col-7" id="do${toDoName}">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a${toDoName}"
              aria-expanded="true" aria-controls="collapseOne">
              ${Topic}
            </button>
          </h2>
          <div id="a${toDoName}" class="accordion-collapse collapse show" aria-labelledby="${Topic}"
            data-bs-parent="#do${toDoName}">
            <div class="accordion-body">
              ${Text}
            </div>
          </div>
        </div>
      </div>
      <div id="date" class="col-2">
        ${Deadline}
      </div>
      <i class="edit col-1 far fa-edit" data-id="${toDoName}"></i>
      <i class="done col-1 fab fa-angellist" data-id="${toDoName}"></i>
      <i class="todo-delete col-1 fa fa-trash" data-id="${toDoName}"></i>
    </div>
    `
    // let test = document.querySelectorAll(`[data-id = ${toDoName}]`)
    // console.log(test)
  },

  renderEditModal(toDoName) {
    view.renderAddModal()
    let toDoTopic = document.querySelector('#toDoTopic')
    let toDoText = document.querySelector('#toDoContent')
    let toDoDeadline = document.querySelector('#toDoDeadline')
    toDoTopic.value = toDocontent[toDoName]['topic']
    toDoText.value = toDocontent[toDoName]['content']
    toDoDeadline.value = toDocontent[toDoName]['date']
    modalContainer.style.display = 'block'
  },

  renderDoneList(toDoName) {
    let toDoItem = document.querySelector(`#todo${toDoName}`)
    let Topic = toDocontent[toDoName]['topic']
    let Text = toDocontent[toDoName]['content']
    let Deadline = toDocontent[toDoName]['date']
    done.innerHTML += `
    <div class="done-sub-container row" id="done${toDoName}">
      <div class="accordion col-7" id="done-item">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${toDoName}"
              aria-expanded="true" aria-controls="collapseOne">
              ${Topic}
            </button>
          </h2>
          <div id="${toDoName}" class="accordion-collapse collapse show" aria-labelledby="${Topic}"
            data-bs-parent="#done-item">
            <div class="accordion-body">
              ${Text}
            </div>
          </div>
        </div>
      </div>
      <div id="done-date" class="col-2">
        ${Deadline}
      </div>
      <i class="done-delete col-1 fa fa-trash" data-id="${toDoName}"></i>
    </div>
    `
    toDoItem.remove()
  },

  renderEditedToDo(previousToDoName, toDoName) {
    let editedToDoItem = document.querySelector(`#todo${previousToDoName}`)
    let Topic = toDocontent[toDoName]['topic']
    let Text = toDocontent[toDoName]['content']
    let Deadline = toDocontent[toDoName]['date']
    editedToDoItem.innerHTML = `
      <div class="accordion col-7" id="do${toDoName}">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a${toDoName}"
              aria-expanded="true" aria-controls="collapseOne">
              ${Topic}
            </button>
          </h2>
          <div id="a${toDoName}" class="accordion-collapse collapse show" aria-labelledby="${Topic}"
            data-bs-parent="#do${toDoName}">
            <div class="accordion-body">
              ${Text}
            </div>
          </div>
        </div>
      </div>
      <div id="date" class="col-2">
        ${Deadline}
      </div>
      <i class="edit col-1 far fa-edit" data-id="${toDoName}"></i>
      <i class="done col-1 fab fa-angellist" data-id="${toDoName}"></i>
      <i class="todo-delete col-1 fa fa-trash" data-id="${toDoName}"></i>
    `

    editedToDoItem.id = `todo${toDoName}`
  }
}

const model = {
  collectToDoInfo () {
    let toDoTopic = document.querySelector('#toDoTopic')
    let toDoText = document.querySelector('#toDoContent')
    let toDoDeadline = document.querySelector('#toDoDeadline')
    let toDoName = toDoTopic.value.split(' ').join('')
    toDocontent[toDoName] = {}
    toDocontent[toDoName]['topic'] = toDoTopic.value
    toDocontent[toDoName]['content'] = toDoText.value
    toDocontent[toDoName]['date'] = toDoDeadline.value
    return toDoName
  },

  removeModalContent () {
    let toDoTopic = document.querySelector('#toDoTopic')
    let toDoText = document.querySelector('#toDoContent')
    let toDoDeadline = document.querySelector('#toDoDeadline')
    toDoTopic.value = ''
    toDoText.value = ''
    toDoDeadline.value = ''
  }
}

const processState = {
  add: 'waitingAdd',
  edit: 'waitingEdit',
  saveAdd: 'saveAdd',
  saveEdit: 'saveEdit',
  moveToDone: 'moveToDone',
  toDoDelete:'removeFromToDoList',
  doneDelete:'removeFromDoneList'
}

const controller = {
  currentState: '',

  dispatchToDoAction (target) {
    if (target.classList.contains('add-item')) {
      this.currentState = processState.add
    } else if (target.classList.contains('edit')) {
      this.currentState = processState.edit
    } else if (target.classList.contains('done')) {
      this.currentState = processState.moveToDone
    } else if (target.classList.contains('todo-delete')) {
      this.currentState = processState.toDoDelete
    } else if (target.classList.contains('done-delete')) {
      this.currentState = processState.doneDelete
    }

    let toDoName = target.dataset.id
    switch (this.currentState) {
      case processState.add:
        view.renderAddModal()
        modalContainer.style.display = 'block'
        this.currentState = processState.saveAdd
        break
      
      case processState.edit:
        view.renderEditModal(toDoName)
        previousToDoName = toDoName
        this.currentState = processState.saveEdit
        break

      case processState.moveToDone:
        view.renderDoneList(toDoName)
        document.querySelector(`#done${toDoName}`).classList.add('checked')
        this.currentState = ''
        delete toDocontent[toDoName]
        break

      case processState.toDoDelete:
        let toDoItem = document.querySelector(`#todo${toDoName}`)
        toDoItem.remove()
        this.currentState = ''
        delete toDocontent[toDoName]
        break

      case processState.doneDelete:
        let doneItem = document.querySelector(`#done${toDoName}`)
        this.currentState = ''
        doneItem.remove()
        break
    }
  },

  dispatchModalAction (event) {
    let target = event.target
    if (target.classList.contains('close')) {
      modalContainer.style.display = 'none'
      model.removeModalContent()
      return
    } else if (target.classList.contains('save') || event.keyCode === 13) {
      let toDoTopic = document.querySelector('#toDoTopic')
      if (toDoTopic.value !== '') {
        if (this.currentState === processState.saveAdd) {
          modalContainer.style.display = 'none'
          let toDoName = model.collectToDoInfo()
          view.renderToDoList(toDoName)
          model.removeModalContent()
        } else if (this.currentState === processState.saveEdit) {
          let toDoName = model.collectToDoInfo()
          view.renderEditedToDo(previousToDoName, toDoName)
          model.removeModalContent()
          modalContainer.style.display = 'none'
          previousToDoName = ''
        }
      } else {
        alert('Please input the name of the event')
      }
    }
  }
}

container.addEventListener('click', event => {
  let target = event.target
  controller.dispatchToDoAction(target)
})

modalMain.addEventListener('click', event => {
  controller.dispatchModalAction(event)
})

modalMain.addEventListener('keypress', event => {
  controller.dispatchModalAction(event)
})

