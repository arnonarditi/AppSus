export const utilService = {
    makeId,
    loadFromStorage,
    saveToStorage,
    makeLorem,
    makeName
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value) || null)
}

function loadFromStorage(key) {
    let data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function makeLorem(wordCount = 100) {
    const words = ['The sky', 'above','baba','roti', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (wordCount > 0) {
        wordCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function makeName() {
    const names = ['Roei', 'Ido', 'Tal', 'Bar', 'Yossi']
    return names[Math.floor(Math.random() * names.length)]
}