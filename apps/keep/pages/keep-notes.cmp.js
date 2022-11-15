import { noteService } from '../services/note.service.js'
import { svgService } from '../../../services/svg.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

import notePreview from '../cmps/note-preview.cmp.js'
import noteFilter from '../cmps/note-filter.cmp.js'
import addNote from '../cmps/note-add.cmp.js'

export default {
    name: 'keep-notes',
    props: [],
    template: `
            <section class="notes-content flex column justify-center align-center">
                <section class="filter flex align-center">
                    <div className="icon" v-html="getSvg('search')"></div>
                    <note-filter @filter="setFilter" />
                </section>
                <add-note @added="addNote"/>
                <section class="pinned" v-if="notes">
                    <div>PINNED</div>
                    <section class="notes-list">
                        <note-preview @updateImgUrl="getImgUrl" @update="updateNote" v-for="(note, idx) in pinnedToShow" :note="note" :key="idx"/>
                    </section>
                </section>

                <section class="others" v-if="notes">
                    <div>OTHERS</div>              
                    <section class="notes-list">
                        <note-preview @updateImgUrl="getImgUrl" @update="updateNote" v-for="(note, idx) in othersToShow" :note="note" :key="idx"/>
                    </section>
                </section>

                <router-view></router-view>
            </section>

        `,
    created() {
        this.getNotes()
    },
    data() {
        return {
            notes: null,
            filterBy: '',
            mail: null
        }
    },
    methods: {
        getNotes() {
            noteService.getNotesToShow(false)
                .then(notes => {
                    this.notes = notes
                })
        },
        addNote(note) {
            this.notes.push(note)
        },
        updateNote(noteId, prop, toUpdate) {
            // console.log(noteId, prop, toUpdate);
            noteService.updateNote(noteId, prop, toUpdate)
                .then((updatedNote) => {
                    if (prop === 'isTrashed') this.removeNote(noteId)
                    else {
                        const idx = this.notes.findIndex(note => note.id === updatedNote.id)
                        this.notes.splice(idx, 1, updatedNote)
                    }
                })

            // console.log(note);
            // updateTitle
            // uptaTxtx
            // uptdatecolor
        },
        setFilter(filterBy) {
            this.filterBy = filterBy
        },
        removeNote(noteId) {
            const idx = this.notes.findIndex(note => note.id === noteId)
            this.notes.splice(idx, 1)
        },
        otherActions() {
            // duplicate
        },
        async getImgUrl(noteId, ev) {
            const url = await noteService.createImg(ev)
            this.updateNote(noteId, 'imgUrl', url)
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
    },
    computed: {
        // notesToShow() {
        //     const regex = new RegExp(this.filterBy.title, 'i')
        //     var notes = this.notes.filter(note => regex.test(note.info.title))
        //     return notes // TODO combine all filters!!!!
        // },
        pinnedToShow() {
            const regex = new RegExp(this.filterBy.title, 'i')
            var notes = this.notes.filter(note => regex.test(note.info.title))
            return notes.filter(note => note.isPinned)
        },
        othersToShow() {
            const regex = new RegExp(this.filterBy.title, 'i')
            var notes = this.notes.filter(note => regex.test(note.info.title))
            return notes.filter(note => !note.isPinned)
        }
    },
    components: {
        notePreview,
        addNote,
        noteFilter
    },

    watch: {
        $route: {
            handler(newValue) {
                if (newValue.query.deleted) this.removeNote(newValue.query);
                this.getNotes()
            },
            deep: true
        }
    }
}