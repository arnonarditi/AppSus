
import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const EMAILS_KEY = 'emailDB'
const LABELS_KEY = 'labelsDB'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}
_createEmails()
_createLabels()

export const emailService = {
    query,
    get,
    put,
    sendEmail,
    removeEmail,
    createDraftEmail,
    post
}


function query(key = EMAILS_KEY) {
    return storageService.query(key)
}
function get(emailId) {
    return storageService.get(EMAILS_KEY, emailId)
}

function put(email) {
    return storageService.put(EMAILS_KEY, email)
}
function removeEmail(emailId) {
    return storageService.remove(EMAILS_KEY, emailId)
}
function post(key, newEntity) {
    return storageService.query(key)
        .then((entities) => {
            entities.push(newEntity)
            utilService.saveToStorage(key, entities)
        })
}

function sendEmail(to = '', subject, body) {
    const newEmail = {
        id: utilService.makeId(),
        tab: 'sent',
        name: 'To: ',
        subject,
        body,
        isRead: false,
        sentAt: Date.now(),
        from: loggedinUser.email,
        to,
        labels: []
    }
    return storageService.post(EMAILS_KEY, newEmail)
}

function createDraftEmail() {
    const draftEmail = {
        id: utilService.makeId(),
        tab: 'draft',
        name: 'Draft',
        subject: '',
        body: '',
        isRead: true,
        sentAt: Date.now(),
        to: '',
        labels: []
    }
    return storageService.post(EMAILS_KEY, draftEmail)
}

// Local Funcs-factory
function _createEmails() {
    let emails = utilService.loadFromStorage(EMAILS_KEY)

    if (!emails || !emails.length) {
        emails = []
        for (var i = 0; i < 16; i++) {
            emails.push(_createEmail())
        }
    }
    utilService.saveToStorage(EMAILS_KEY, emails)
    return emails
}

function _createLabels() {
    let labels = utilService.loadFromStorage(LABELS_KEY)

    if (!labels || !labels.length) {
        labels = []
        labels.push('University')
        labels.push('General')
    }
    utilService.saveToStorage(LABELS_KEY, labels)
    return labels
}

function _createEmail() {
    const name = utilService.makeName()
    const email = {
        id: utilService.makeId(),
        tab: 'inbox',
        name: name,
        subject: utilService.makeLorem(3),
        body: utilService.makeLorem(50),
        isRead: false,
        sentAt: Date.now(),
        from: `${name}@gmail.com`,
        to: `${loggedinUser.email}`,
        labels: []
    }

    return email
}

