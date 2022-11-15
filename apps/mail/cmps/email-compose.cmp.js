import { emailService } from '../services/mail.service.js'
import { svgService } from '../../../services/svg.service.js'
import { eventBus } from '../../../services/event-bus.service.js'

export default {
    props: [],
    template: `

    <section class="email-compose flex column">
        <header class="flex space-between align-center">
            <h4>New Message</h4>
            <div>
                <button @click="backTolist">
                <img style="width:18px; height:18px" :src="getMailSvg('button1')" alt="" />
                </button>
            </div>
        </header>
        <section class="main-content flex grow">
            <form class="flex column grow" @submit.prevent="sendEmail" >
                <input placeholder="To" type="text" v-model="emailProps.to" />
                <input placeholder="Subject" type="text" v-model="emailProps.subject" />
              
                <div ref="quill" id="quill-container" class="grow"  @input="quillData"></div>
                <!-- <textarea  id="quill-container" name="" class="grow" v-model="emailProps.body"  >
                </textarea> -->
                <button class="send-btn">Send</button>
            </form>
            </section>
    </section>
    `,
    data() {
        return {
            emailProps: {
                to: '',
                subject: '',
                body: ''
            },

        }
    },
    mounted() {
        new Quill('#quill-container', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block']
                ]
            },
            theme: 'snow'  // or 'bubble'
        });
    },
    created() {
        eventBus.on('composeEmailWithNoteData', this.composeEmailWithNoteData)
    },
    methods: {
        quillData() {
            const quillCont = this.$refs.quill
            this.emailProps.body = quillCont.innerText
        },
        //todo-handle that info from note
        composeEmailWithNoteData(note) {
            emailService.createDraftEmail()
                .then(email => {
                    eventBus.emit('setCurrDraft', email)
                    this.emailProps.subject = note.info.title
                    this.$refs.quill.innerText = note.info.text
                    this.emailProps.body = note.info.text
                })
        },
        sendEmail() {
            const { emailProps: { to, subject, body } } = this
            emailService.sendEmail(to, subject, body)
                .then(() => {
                    this.$router.back()
                })
        },
        backTolist() {
            const tab = this.$route.query.tab
            const path = this.$route.path
            this.$router.push({ path, query: { tab } })
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
    },
    watch: {
        emailProps: {
            handler() {
                eventBus.emit('updateCurrDraft', this.emailProps)
            },
            deep: true
        }
    },
    components: {

    }
}