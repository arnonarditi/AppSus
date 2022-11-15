
import { emailService } from '../services/mail.service.js'
import { svgService } from '../../../services/svg.service.js'
import { eventBus } from '../../../services/event-bus.service.js'


export default {
    props: [],
    template: `
	<section className="email-details full-height flex column">
		<section  class="action-bar flex align-center">
			<img style="width:20px; height:20px" @click="backToList" :src="getMailSvg('back')" alt="" />
			<div  @click="setTabToTrash('trash')" v-html="getMailSvg('trash')"></div>
			<img style="width:20px; height:20px" @click="toggleStarTab()" :src="getMailSvg('star')" alt="" />
			<img style="width:20px; height:20px" @click="toggleReadProp()" :src="getMailSvg('readStat')" alt="" />
		</section>

		<section v-if="email" class="details-content">
            <section class="labels-bar flex align-center">
               <h2>{{email.subject}}</h2> 
               <div  class="labels-det flex align-center">
                   <span v-for="label in email.labels">
                       {{label}}
                    </span>
                    
                </div>
            </section>
			<header class="flex">
				<h4> 
                    <span>{{email.name}}</span> 
                    <span class="small"> &lt;{{email.from}}&gt;</span></h4>
                <!-- //todo more detailed date format -->
                <span class="small">{{formattedDate}}</span>
			</header>
            <p>{{email.body}}</p>
		</section>
		
        <footer>
            <button>Replay</button>
            <button>Forward</button>
            <!-- //todo -design -->
            <button @click="composeNoteFromEmail">Send To Notes</button>
        </footer>

	</section>
`,
    data() {
        return {
            email: null,
            prvTab: ''
        }
    },
    created() {
        this.loadEmailDetails()
        this.prvTab = this.$route.query.tab
    },
    methods: {
        composeNoteFromEmail(){
            eventBus.emit('composeNoteFromEmail',this.email)
        },
        loadEmailDetails() {
            emailService.get(this.emailId)
                .then(email => this.email = email)
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
        backToList() {
            this.$router.back()
        },
        setTabToTrash(tab) {
            this.email.tab = tab
            emailService.put(this.email)
                .then(() => this.backToList())
        },
        toggleStarTab() {
            if (this.email.tab === 'star') this.email.tab = 'inbox'
            else this.email.tab = 'star'
            emailService.put(this.email)
        },
        toggleReadProp() {
            this.email.isRead = !this.email.isRead
            emailService.put(this.email)
        }
    },
    computed: {
        emailId() {
            return this.$route.params.id
        },
        formattedDate() {
            const month = new Date(this.email.sentAt).toLocaleString('default', { month: 'short' })
            const day = new Date(this.email.sentAt).getDate()
            return month + ' ' + day
        }
    },
}