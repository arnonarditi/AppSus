
//todo change path after moving to the main header
import { eventBus } from "../../../services/event-bus.service.js"
import { svgService } from '../../../services/svg.service.js'

export default {
    props: [],
    template: `
    <section className="email-filter flex column">
		<div class="main-wrapper flex space-between align-center">
			<div class="sub-wrap flex align-center grow" >
				<div className="icon" v-html="getMailSvg('search')"></div>
				<input placeholder="Search mail" class="grow" type="text" v-model="filterBy.name" @input="setFilter" />
			</div>
			<div style="cursor:pointer" className="icon" v-html="getMailSvg('filterBtn')" @click="toggleShown"></div>

		</div>

		<section v-if="selectShown" class="select-wrapper flex column space-even">
			<!-- filter -->
			<div class="sub flex space-between align-center ">
				<span> Filter by</span>
				<select v-model="filterBy.readStat" @change="setFilter">
					<option>All</option>
					<option>Read</option>
					<option>unread</option>
				</select>
			</div>
			<!-- //sort -->
			<div class="sub flex space-between align-center">
				<span>Sort by</span>
				<select v-model="sortBy" @change="setSort">
					<option value="name">name</option>
					<option value="date">date</option>
				</select>
			</div>

		</section>

	</section>
`,
    data() {
        return {
            filterBy: {
                name: '',
                readStat: 'All',
            },
            sortBy: 'date',
            selectShown: false,
        }
    },
    methods: {
        setFilter() {
            eventBus.emit('filter-by', this.filterBy)
            this.selectShown = !this.selectShown
        },
        setSort() {
            eventBus.emit('sort-by', this.sortBy)
            this.selectShown = !this.selectShown
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
        toggleShown() {
            this.selectShown = !this.selectShown
        }
    },
    computed: {
    },
    components: {
    }
}