export default {
    name: 'note-text',
    props: ['info', 'isDetails'],
    template: `
            <div :contenteditable="isDetails" @input="onChangeText">{{ info.text }}</div>
        `,
    components: {},
    created() {},
    data() {
        return {}
    },
    methods: {
        onChangeText(ev) {
            this.$emit('update', 'text', ev.target.innerText)
        }
    },
    computed: {},
}