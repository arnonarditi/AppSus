import { noteService } from '../services/note.service.js'
import { svgService } from '../../../services/svg.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

import canvasNote from './note-canvas.cmp.js'

export default {
    name: 'note-add',
    props: [],
    template: `
            <section class="add-note">
                <img :src="imgUrl" class="note-img" />
                <component @update="update" :is="note.type" :info="note.info" :isDetails="true"></component>
                <section class="add-note-title">
                    <input ref="title" v-model="note.info.title" type="text" placeholder="Add title"/>
                </section>
                <section class="add-note-content">
                    <input ref="textContent" type="text" v-model="content" :placeholder="placeholderText"/>
                </section>
                <section class="action-container flex">
                    <span class="icon">
                        <button @click="textNote" v-html="getSvg('text1')"></button>
                    </span>
                    <span class="icon">
                        <button @click="checkListNote" v-html="getSvg('checkBox')"></button>
                    </span>
                    <label class="icon">
                        <div v-html="getSvg('img')"></div>
                        <input type="file" class="file-input btn" name="image" @change="getImgUrl" style="display: none"/>
                    </label>
                    <span class="icon">
                        <button @click="canvasNote" v-html="getSvg('pencil2')"></button>
                    </span>
                    <span class="icon">
                    <button @click="mapNote" v-html="getSvg('location')"></button>
                    </span>
                    <span>
                        <button class="close-btn" @click="saveNote">Close</button>                    
                    </span>
                </section>
            </section>
        `,
    created() {
        this.note = noteService.getEmptyNote()
        this.textNote()
        eventBus.on('composeNoteWithEmailData', this.composeNoteFromMail)
    },
    data() {
        return {
            isExpand: false,
            note: {},
            contentPlaceholder: '',
            content: ''
        }
    },
    methods: {
        setExpand() {
            this.isExpand = !this.isExpand
            console.log(this.isExpand);
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        saveNote() {
            if (this.note.type === 'todoNote') this.createTodos()
            else this.note.info.text = this.content
                //TODO: remove noteService!!
            noteService.save(this.note)
                .then(note => {
                    this.$emit('added', note)
                    this.note = noteService.getEmptyNote()
                    this.content = ''
                    this.textNote()
                })
        },
        async getImgUrl(ev) {
            const url = await noteService.createImg(ev)
            this.note.imgUrl = url
        },
        checkListNote() {
            this.contentPlaceholder = 'Enter comma separeted list...'
            this.note.type = 'todoNote'
        },
        createTodos() {
            var todos = this.content.split(',')
            todos = todos.map(todo => {
                return {
                    text: todo,
                    doneAt: null
                }
            })
            this.note.info.todos = todos
        },
        mapNote() {
            this.contentPlaceholder = 'Enter loaction...'
            this.note.type = 'mapNote'
        },
        textNote() {
            this.note.type = 'textNote'
            this.contentPlaceholder = 'Take a note...'
        },
        canvasNote() {
            this.note.type = 'canvasNote'
        },
        update(prop, toUpdate) {
            this.note.info.canvasUrl = toUpdate
        },
        composeNoteFromMail(mail) {
            this.note.type = 'textNote'
            this.note.info.title = mail.subject
            this.note.info.text = mail.body
            console.log(this.$refs.textContent);
            this.$refs.title.value = mail.subject
                // this.$refs.noteContent.value = mail.body
        }
    },
    computed: {
        imgUrl() {
            return this.note.imgUrl
        },
        placeholderText() {
            return this.contentPlaceholder
        },
        getClass() {
            return `add-note flex column justify-between ${this.isExpand&&'expand'}`
        }
    },
    components: {
        canvasNote,
    },
}