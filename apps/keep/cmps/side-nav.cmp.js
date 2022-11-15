import { svgService } from '../../../services/svg.service.js'

export default {
    name: 'side-nav',
    props: [],
    template: `
            <section class="nav-container">
                <div class="nav-icon" :class="isNotesActive">
                    <router-link :to="{name:'keep-notes'}">
                        <div v-html="getSvg('lightBolb')"></div>
                    </router-link> 
                </div>
                <div class="nav-icon" :class="isTrashActive">
                    <router-link :to="{name:'keep-trash'}">
                        <div v-html="getSvg('trash')"></div>    
                    </router-link> 
                </div>
            </section>

        `,
    components: {},
    created() {},
    data() {
        return {

        }
    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
    },
    computed: {
        isNotesActive() {
            if (this.$route.name === 'keep-notes') return 'active'
        },
        isTrashActive() {
            if (this.$route.name === 'keep-trash') return 'active'
        }
    },
}