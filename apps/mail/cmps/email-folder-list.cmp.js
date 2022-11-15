
import { svgService } from '../../../services/svg.service.js'
import { eventBus } from "../../../services/event-bus.service.js"
import { emailService } from '../services/mail.service.js'

import addLabel from './add-label.cmp.js'
export default {
    props: [],
    template: `
   	<section class="email-folder-list flex column">
		<div class="compose-wrapper flex ">
			<div class="compose flex align-center center" @click="composeEmail()">
				<div class="compose-icon" v-html="getMailSvg('pencil')"></div>
				<span class="com-text">Compose</span> 
			</div>
		</div>

		<section class="folders-nav">

			<div @click="setTab('inbox')">
				<img style="width:20px; height:20px" :src="getMailSvg('inbox')" alt="" />
				<span class="f-text">Inbox</span>
			</div>

			<div @click="setTab('star')">
				<img style="width:20px; height:20px" :src="getMailSvg('star')" alt="" />
				<span class="f-text"> Starred</span>
			</div>
			<div @click="setTab('important')">
				<img style="width:20px; height:20px" :src="getMailSvg('important')" alt="" />
				<span class="f-text">Important</span>
			</div>
			<div @click="setTab('sent')">
				<img style="width:20px; height:20px" :src="getMailSvg('sent')" alt="" />
				<span class="f-text">Sent</span>
			</div>

			<div @click="setTab('trash')">
				<div v-html="getMailSvg('trash')"></div>

				<span class="f-text">Trash</span>
			</div>

			<div @click="setTab('draft')">
				<img style="width:20px; height:20px" :src="getMailSvg('draft')" alt="" />

				<span class="f-text">Drafts</span>
			</div>

			<div @click="isAddLabel=true" class="labels">
				<header class="label-header flex space-between align-center">
					<h4>Labels</h4>
					<img  style="width:20px; height:20px" :src="getMailSvg('addLabel')" alt="" />
				</header>
			</div>

            <div @click="navToLabel(label)" v-if="labels" v-for="label in labels" :key="label">
            <img style="width:20px; height:20px" :src="getMailSvg('folderLabel')" />
            <span class="f-text">{{label}}</span>
            </div>

            <add-label v-if="isAddLabel"></add-label>


		</section>
	</section>

`,
    data() {
        return {
            labels: null,
            isAddLabel: false
        }
    },
    created() {
        this.getLabels()
        eventBus.on('cancelLabeling', this.cancelLabeling)
        eventBus.on('createLabel', this.createLabel)
        
    },
    methods: {
        setTab(tab) {
            if(!this.$route.query.compose){
                this.$router.push({ path: '/mail/list', query: { tab: `${tab}` } })
            }else{
                this.$router.push({ path: '/mail/list', query: { tab: `${tab}`,compose:'new'} })
            }
            eventBus.emit('zeroingLabelFilter')
        },
      
        composeEmail() {
            const tab = this.$route.query.tab
            this.$router.push({
                path: '/mail/list',
                query: { tab, compose: 'new' }
            })
            emailService.createDraftEmail()
                .then(email => eventBus.emit('setCurrDraft', email))
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
        getLabels() {
            emailService.query('labelsDB')
                .then(labels => this.labels = labels)
        },
        navToLabel(label) {
            eventBus.emit('setLabelFilter', label)
        },
        cancelLabeling(falsy) {
            this.isAddLabel = falsy
        },
        createLabel(newLabel) {
            emailService.post('labelsDB', newLabel)
                .then(() => {
                    this.getLabels()
                    eventBus.emit('updateLabels')
                })
        }
    },
    computed: {
    },
    components: {
        addLabel
    }
}
