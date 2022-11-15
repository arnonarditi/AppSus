export default {
    name: 'note-todo',
    props: ['info'],
    template: `
        <ul>
            <li v-for="(todo, idx) in info.todos">
                {{ todo.text }}
            </li>
        </ul>
        `,
    components: {},
    created() {},
    data() {
        return {}
    },
    methods: {},
    computed: {},
}