import { emailService } from '../services/mail.service.js'
import { eventBus } from "../../../services/event-bus.service.js"
import { svgService } from '../../../services/svg.service.js'

import emailPreview from '../cmps/email-preview.cmp.js'
import emailCompose from '../cmps/email-compose.cmp.js'

export default {
    props: [],
    template: `
  	<section v-if="emails" className="email-list">
		<div v-if="selectedEmail.checked" class="actions-bar flex align-center ">
			<img title="refresh" style="width:20px; height:20px" :src="getMailSvg('refresh')" />
			<div @click="setToTrashFolder" v-html="getMailSvg('trash')"></div>
			<img title="change reading status" style="width:20px; height:20px" @click="toggleReadProp()"
				:src="getMailSvg('readStat')" />
			<img title="snooze" style="width:20px; height:20px" :src="getMailSvg('snooze')" />

            <section class="labels-container" >
                <img @click="toggleLabelListVis" title="label" style="width:20px; height:20px"
                 :src="getMailSvg('label')" />

                <section v-if="isEditLabels" class="labels-list">
                    <header>Label as:</header>
                    <div v-for="label in labels" :key="label" class="label-item flex align-center">
                        <input type="checkbox" :checked="isLabeled(label)" @input="toggleCurrLabel(label)" />
                        <span>{{label}}</span>
                    </div>
                    <div class="label-actions flex align-center">
                        <div class="" @click="applyChanges">Apply</div>

                    </div>
                </section>
            </section>
            
		</div>
		
		<ul class="clean-list">
			<li v-for="email in emailsToShow" :key="email.id">
				<!-- //todo consider make preview as smart cmp -->
				<email-preview :email="email" :filterTab="filterTab" 
                @isRead="setEmailReadStat" 
                @toggleTab="toggleTab"
				@toTrashFolder="setToTrashFolder"
                @removeEmail="removeEmail" 
                @toggleActionBar="toggleActionBar" />
			</li>
		</ul>

		<email-compose v-if="isCompose"> </email-compose>
	</section>
`,
    data() {
        return {
            emails: null,
            filterTab: '',
            filterBy: {},
            sortBy: '',
            selectedEmail: {
                checked: false,
                email: {}
            },
            composeInterval: '',
            currDraft: null,
            labels: null,
            isEditLabels: false,
            isLabelFilter: ''
        }
    },

    created() {
        this.filterTab = this.$route.query.tab
        this.getEmailsByTab()
        this.getLabels()

        eventBus.on('filter-by', this.setFilterByProp)
        eventBus.on('sort-by', this.setSortByProp)
        // draftemail handlers cus-events
        eventBus.on('setCurrDraft', this.setCurrDraft)
        eventBus.on('updateCurrDraft', this.updateCurrDraft)
        //label handlers cus-events
        eventBus.on('zeroingLabelFilter', this.setLabelFilter)
        eventBus.on('setLabelFilter', this.setLabelFilter)
        eventBus.on('updateLabels', this.getLabels)
    },

    methods: {
        setLabelFilter(str = '') {
            this.isLabelFilter = str
            this.getEmailsByTab()
        },
        getLabels() {
            emailService.query('labelsDB')
                .then(labels => this.labels = labels)
        },
        toggleLabelListVis() {
            this.isEditLabels = !this.isEditLabels
        },
        isLabeled(label) {
            const { labels } = this.selectedEmail.email
            return labels.some(l => l === label)
        },
        toggleCurrLabel(label) {
            const { labels } = this.selectedEmail.email
            const idx = labels.findIndex(l => l === label)
            if (idx === -1) labels.push(label)
            else labels.splice(idx, 1)
        },
        applyChanges() {
            emailService.put(this.selectedEmail.email)
            this.isEditLabels = false

        },
        //todo-change the name of func
        getEmailsByTab() {
            emailService.query()
                .then(emails => this.emails = emails)
                .then(() => {
                    let filteredEmails
                    //when nav by tab
                    if (!this.isLabelFilter) {
                        //inbox||starred
                        if (this.filterTab === 'inbox') {
                            filteredEmails = this.emails.filter(e => (e.tab === 'inbox' || e.tab === 'star' || e.tab === 'important'))
                        }
                        else filteredEmails = this.emails.filter(e => e.tab === this.filterTab)
                    }
                    //when nav by label
                    else {
                        filteredEmails = this.emails.filter(e => e.labels.some(l => l === this.isLabelFilter))
                    }
                    this.emails = filteredEmails
                    this.selectedEmail.checked = false

                })
        },
        toggleActionBar(payload) {
            this.selectedEmail = payload
        },
        setFilterByProp(filterBy) {
            this.filterBy = filterBy
        },
        setSortByProp(sortBy) {
            this.sortBy = sortBy
        },
        setEmailReadStat(email) {
            emailService.put(email)
        },
        toggleTab(email) {
            emailService.put(email)
        },
        toggleReadProp() {
            const { email } = this.selectedEmail
            email.isRead = !email.isRead
        },
        setToTrashFolder() {
            const { email } = this.selectedEmail
            if (email.tab === 'trash') {
                this.removeEmail(email)
                return
            }
            email.tab = 'trash'
            emailService.put(email)
                .then(() => this.getEmailsByTab())

        },
        removeEmail(email) {
            emailService.removeEmail(email.id)
                .then(() => this.getEmailsByTab())
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
        updateComposePropsToService() {
            emailService.put(this.currDraft)
                .then(() => this.getEmailsByTab())
        },
        setCurrDraft(email) {
            this.currDraft = email
        },
        updateCurrDraft(emailProps) {
            this.currDraft.subject = emailProps.subject
            this.currDraft.body = emailProps.body
        }
    },
    computed: {
        isCompose() {
            if (this.$route.query.compose) {
                this.composeInterval = setInterval(this.updateComposePropsToService, 5000)
                return true
            }
            else {
                clearInterval(this.composeInterval)
                return false
            }
        },
        emailsToShow() {
            const { name, readStat } = this.filterBy
            if (!name && !readStat) return this.emails

            const regex = new RegExp(name, 'i')
            var emails = this.emails.filter(e => regex.test(e.name))

            if (readStat.length && readStat !== 'All') {
                if (readStat === 'Read') emails = emails.filter(e => e.isRead)
                else emails = emails.filter(e => !e.isRead)
            }

            return emails
        },
        sortByOrder() {
            if (this.sortBy === 'name') {
                this.emails.sort((e1, e2) => e1.name.localeCompare(e2.name))
            } else if (this.sortBy === 'date') {
                this.emails.sort((e1, e2) => (e1.sentAt - e2.sentAt))
            }
        }
    },
    components: {
        emailPreview,
        emailCompose
    },
    watch: {
        '$route.query.tab': {
            handler() {
                this.filterTab = this.$route.query.tab
                this.getEmailsByTab()
            }
        },
        '$route.query.compose': {
            handler() {
                //todo check why its not react to the clearInterval
                if (!this.$route.query.compose) {
                    clearInterval(this.composeInterval)
                }
            }
        },
        filterBy: {
            handler() {
                this.emailsToShow
            },
            deep: true
        },
        sortBy: {
            handler() {
                this.sortByOrder
            }
        }
    }
}