import { svgService } from '../../../services/svg.service.js'
import { eventBus } from '../../../services/event-bus.service.js'


import noteActions from './note-actions.cmp.js'
import textNote from './note-text.cmp.js'
import todoNote from './note-todo.cmp.js'
import mapNote from './note-map.cmp.js'
import canvasNote from './note-canvas.cmp.js'

export default {
    name: 'note-preview',
    props: ['note'],
    template: `
        <section class="note-item">
            <router-link :to="{name:'note-details' ,params:{id:note.id}}">
                <section :style='{backgroundColor: note.color}' class="note-preview">
                    <img :src="getUrl" class="note-img" />
                    <section class="note-title">{{ note.info.title }}</section>
                    <section class="note-content">
                        <component :is="note.type" :info="note.info"></component>
                    </section>
                    <note-actions @sendMail="sendMail" @update="update" @updateImgUrl="updateImgUrl" :note="note"></note-actions>
                </section>
                <div @click.stop.prevent="togglePin" class="icon pin-icon">
                    <img style="width:24px; height:24px" :src="isPinned" alt="" />
                </div>
            </router-link>
        </section>
        `,
    created() {},
    data() {
        return {}
    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        update(prop, toUpdate) {
            this.$emit('update', this.note.id, prop, toUpdate)
        },
        updateImgUrl(ev) {
            this.$emit('updateImgUrl', this.note.id, ev)
        },
        sendMail() {
            eventBus.emit('composeEmailFromNote', this.note)
        },
        togglePin() {
            this.note.isPinned = !this.note.isPinned
        }
    },
    computed: {
        getUrl() {
            if (this.note.type === 'canvasNote') return this.note.info.canvasUrl
            return this.note.imgUrl
        },
        isPinned() {
            if (this.note.isPinned) return this.getSvg('bookMark')
            return this.getSvg('bookMarkEmpty')
        },
    },
    components: {
        textNote,
        noteActions,
        todoNote,
        mapNote,
        canvasNote,
    },
}