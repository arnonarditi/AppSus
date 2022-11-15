import { svgService } from '../../../services/svg.service.js'

export default {
    props: ['email', 'filterTab'],
    template: `
   
        <section  @click="goToDetails"
        class="email-preview flex "
        :class="isRead">
    
        <div class="flex align-center">
            <div class="p-s-wrapper flex  align-center">
                <input title="select" type="checkbox" ref="checkbox"  @click.stop="toggleSelect" />
            <img v-if="!isStarred"  style="width:20px; height:20px" @click.stop="toggleTab('star')" :src="getMailSvg('starBase')" alt="" />
            <img v-if="isStarred"  style="width:20px; height:20px" @click.stop="toggleTab('star')" :src="getMailSvg('starYellow')" alt="" />
            <img v-if="!isImp"  style="width:20px; height:20px" @click.stop="toggleTab('important')"  :src="getMailSvg('impBase')" alt="" />
            <img v-if="isImp"  style="width:18px; height:18px" @click.stop="toggleTab('important')"  :src="getMailSvg('impYellow')" alt="" />

            <h4> {{nameByType}}</h4>
            </div>
        </div>
                <h4 class="email-subject">{{email.subject}}<span class="small">{{getShortBody}}</span> </h4>
                
                <h5 class="date">{{formattedDate}}</h5>
        </section>
`,
    data() {
        return {

        }
    },
    methods: {
        goToDetails() {
            this.email.isRead = true
            this.$router.push(`/mail/list/${this.email.id}`)
            this.$emit('isRead', this.email)
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
        toggleTab(tab) {
            if (this.email.tab === tab) this.email.tab = 'inbox'
            else this.email.tab = tab
            this.$emit('toggleTab', this.email)
        },
        toggleSelect() {
            const checked = this.$refs.checkbox.checked
            this.$emit('toggleActionBar', { checked, email: this.email })
        }

    },
    computed: {
        getShortBody() {
            if (this.email.body < 10) return this.email.body
            return '- ' + this.email.body.slice(0, 10) + '...'
        },
        isRead() {
            return { isRead: this.email.isRead }
        },
        isStarred() {
            return this.email.tab === 'star'
        },
        isImp() {
            return this.email.tab === 'important'
        },
        formattedDate() {
            const month = new Date(this.email.sentAt).toLocaleString('default', { month: 'short' })
            const day = new Date(this.email.sentAt).getDate()
            return month + ' ' + day
        },
        nameByType() {
            if (this.email.tab === 'sent') return this.email.name + this.email.to
            return this.email.name
        }
    },
}