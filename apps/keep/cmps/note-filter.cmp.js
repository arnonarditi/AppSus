export default {
    name: 'note-filter',
    props: [],
    template: `
            <input @input="filter" v-model="filterBy.title" type="text" placeholder="Search" />
        `,
    components: {},
    created() {},
    data() {
        return {
            filterBy: {
                title: ''
            }
        }
    },
    methods: {
        filter() {
            this.$emit('filter', this.filterBy)
        }
    },
    computed: {},
}