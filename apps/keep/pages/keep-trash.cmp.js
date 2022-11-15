import { noteService } from '../services/note.service.js'
import notePreview from '../cmps/note-preview.cmp.js'

export default {
    name: 'keep-trash',
    props: [],
    template: `
        <section class="notes-content flex column justify-center align-center">
            <section class="notes-list" v-if="notes">
                <note-preview @update="updateNote" v-for="(note, idx) in notes" :note="note" :key="idx"/>
            </section>
        </section>

        `,
    created() {
        noteService.getNotesToShow(true)
            .then(notes => {
                this.notes = notes
            })
    },
    data() {
        return {
            notes: null
        }
    },
    methods: {},
    computed: {},
    components: {
        notePreview
    },
}