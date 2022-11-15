import { svgService } from '../../../services/svg.service.js'
import { noteService } from '../services/note.service.js'
import { showSuccessMsg } from "../../../services/event-bus.service.js"

import noteActions from '../cmps/note-actions.cmp.js'
import textNote from '../cmps/note-text.cmp.js'
import todoNote from '../cmps/note-todo.cmp.js'
import mapNote from '../cmps/note-map.cmp.js'
import canvasNote from '../cmps/note-canvas.cmp.js'

export default {
    name: 'note-details',
    props: ['id'],
    template: `
            <section v-if="note" class="note-details" :style='{backgroundColor: note.color}'>
                <section class="details-preview">
                    <img v-if="isNotCanvas" :src="note.imgUrl" class="note-img" />
                    <section contenteditable="true" @input="onChangeTitle" class="note-title">{{ note.info.title }}</section>
                    <section class="note-content">
                        <component @update="update" :is="note.type" :info="note.info" :isDetails="true"></component>
                    </section>
                    <note-actions @sendMail="sendMail" @updateImgUrl="getImgUrl" @update="update"></note-actions>
                    <button @click="close" class="close-btn">Close</button>
                </section>  
            </section>  
        `,
    created() {
        noteService.getById(this.id)
            .then(note => {
                this.note = note
            })
    },
    data() {
        return {
            note: null
        }
    },
    methods: {
        update(prop, toUpdate) {
            // console.log(prop, toUpdate);
            noteService.updateNote(this.id, prop, toUpdate)
            if (prop === 'isTrashed') {
                this.$router.push(`/keep/notes?deleted=${this.id}`)
                showSuccessMsg(`Note trashed`)
            } else {
                this.note[prop] = toUpdate
            }
        },
        close() {
            this.$router.push('/keep/notes')
        },
        onChangeTitle(ev) {
            this.update('title', ev.target.innerText)
        },
        async getImgUrl(ev) {
            const url = await noteService.createImg(ev)
            this.update('imgUrl', url)
        },
        sendMail() {
            eventBus.emit('composeNote', this.note)
        }
    },
    computed: {
        isNotCanvas() {
            return this.note.type !== 'canvasNote'
        }
    },
    components: {
        noteActions,
        textNote,
        todoNote,
        mapNote,
        canvasNote,
    },
}