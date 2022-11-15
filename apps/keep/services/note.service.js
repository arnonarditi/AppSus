import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

export const noteService = {
    query,
    getEmptyNote,
    getById,
    save,
    remove,
    getNotesToShow,
    updateNote,
    createImg,
}

var gNotes = [{
        id: 'n100',
        type: 'textNote',
        isPinned: true,
        isTrashed: false,
        color: '#fdcfe8',
        imgUrl: 'assets/img/4.jpg',
        info: {
            title: 'reprehenderit in voluptate',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
        }
    },
    {
        id: 'n101',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#cbf0f8',
        imgUrl: '',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Morbi tristique senectus et netus et. Enim nunc faucibus a pellentesque sit amet. Lobortis feugiat vivamus at augue eget. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Nunc consequat interdum varius sit amet mattis.Enim nunc faucibus a pellentesque sit amet. Lobortis feugiat vivamus at augue eget. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Nunc consequat interdum varius sit amet mattis. A diam sollicitudin '
        }
    },
    {
        id: 'n102',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#e6c9a8',
        imgUrl: 'assets/img/2.jpg',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sphasellus vestibulum. Nunc consequat interdum varius sit amet mattis. A diait amet,tis.Enim nunc faucibus a pellentesque sit amet. Lobortis feugiat vivamus at augue eget. Eget m consectetur adipiscing elit,hasellus vestibulum. Nunc consequat interdum varius sit amet ma diam ut venenatis tellus in.'
        }
    },
    {
        id: 'n200',
        type: 'mapNote',
        isPinned: false,
        isTrashed: false,
        color: '#fdcfe8',
        info: {
            title: 'Work',
            text: 'Ichilov hospital'
        }
    },
    {
        id: 'n103',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#f28b82',
        imgUrl: '',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lobortis feugiat vivamus at augue eget. Id aliquet risus feugiat in ante. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Parturient montes nascetur ridiculus mus mauris vitae. Quis lectus nulla at volutpat diam ut venenatis tellus in.'
        }
    },
    {
        id: 'n104',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#aecbfa',
        imgUrl: 'assets/img/5.jpg',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lobortis feugiat vivamus at augue eget. Id '
        }
    },
    {
        id: 'n108',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#e8eaed',
        imgUrl: 'assets/img/3.jpg',
        info: {
            title: 'Enim nunc faucibus',
            text: ''
        }
    },
    {
        id: 'n106',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#d7aefb',
        imgUrl: '',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sit amet, a.'
        }
    },
    {
        id: 'n107',
        type: 'todoNote',
        isPinned: false,
        isTrashed: false,
        color: '#e6c9a8',
        imgUrl: 'assets/img/7.jpg',
        info: {
            title: 'TODO THIS WEEK!',
            todos: [
                { text: 'Driving liscence', doneAt: null },
                { text: 'Coding power', doneAt: Date.now() },
            ]
        }
    },
    {
        id: 'n105',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '',
        imgUrl: 'assets/img/6.jpg',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sit amet, a. Lobortis feugiat vivamus at augue eget. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Parturient montes nascetur ridiculus mus mauris vitae. Quis lectus nulla atLobortis feugiat vivamus at augue eget. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Parturient montes nascetur ridiculus mus mauris vitae. Quis lectus nulla volutpat diam ut venenatis tellus in.'
        }
    },
    {
        id: 'n110',
        type: 'canvasNote',
        isPinned: false,
        isTrashed: false,
        color: '#f28b82',
        info: {
            title: 'Canvas',
            canvasUrl: 'assets/img/canvas.png'
        }
    },
    {
        id: 'n105',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '#fdcfe8',
        imgUrl: 'assets/img/8.jpg',
        info: {
            title: 'Enim nunc faucibus',
            text: 'Lorem ipsum dolor sit amet'
        }
    },

]

const STORAGE_KEY = 'notesDB'

_createNotes()

function query() {
    return storageService.query(STORAGE_KEY)
}

function getNotesToShow(isTrash) {
    return query()
        .then(notes => notes.filter(note => note.isTrashed === isTrash))
}

function getById(noteId) {
    return storageService.get(STORAGE_KEY, noteId)
}

function updateNote(noteId, prop, toUpdate) {
    return getById(noteId)
        .then(note => {
            switch (prop) {
                case 'isTrashed':
                    note.isTrashed = toUpdate
                    break
                case 'color':
                    note.color = toUpdate
                    break
                case 'text':
                    note.info.text = toUpdate
                    break
                case 'title':
                    note.info.title = toUpdate
                    break
                case 'imgUrl':
                    note.imgUrl = toUpdate
                    break
                case 'canvasUrl':
                    note.info.canvasUrl = toUpdate
                    break
            }
            save(note)
            return (note)
        })
}

function save(note) {
    if (note.id) {
        return storageService.put(STORAGE_KEY, note)
    } else {
        return storageService.post(STORAGE_KEY, note)
    }
}

function remove(noteId) {
    return storageService.remove(STORAGE_KEY, noteId)
}

function getEmptyNote() {
    return {
        id: '',
        type: 'textNote',
        isPinned: false,
        isTrashed: false,
        color: '',
        imgUrl: '',
        info: {
            title: '',
        }
    }
}

function createImg(ev) {
    return new Promise(resolve => {
        const reader = new FileReader()

        reader.onload = function(event) {
            let img = new Image()
            img.src = event.target.result

            resolve(img.src)
        }
        reader.readAsDataURL(ev.target.files[0])
    })
}

function _createNotes() {
    let notes = utilService.loadFromStorage(STORAGE_KEY)
    if (!notes || !notes.length) utilService.saveToStorage(STORAGE_KEY, gNotes)
}