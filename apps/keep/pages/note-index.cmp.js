import sideNav from '../cmps/side-nav.cmp.js'

export default {
    name: 'note-index',
    props: [],
    template: `
        <section class="main-container flex">
            <section class="side-nav-container">
                <side-nav></side-nav>
            </section>
            <section class="content-container">
                <router-view></router-view>
            </section>
        </section>

        `,
    created() {},
    data() {
        return {}
    },
    methods: {},
    computed: {},
    components: {
        sideNav,
    },
}