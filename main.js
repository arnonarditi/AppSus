const { createApp } = Vue

import { router } from './routes.js'
import { eventBus } from './services/event-bus.service.js'

import appHeader from './cmps/app-header.cmp.js'
import userMsg from './cmps/user-msg.cmp.js'

const options = {
    template: `
        <section class="full-height" >
            <app-header />
          <div class="router-view-wrapper full-height">
              <router-view />
          </div>
            <user-msg />
        </section>
    `,
    components: {
        appHeader,
        userMsg,
    },
    created() {
        eventBus.on('composeEmailFromNote', this.composeEmailFromNote)
        eventBus.on('composeNoteFromEmail', this.composeNoteFromEmail)
    },
    methods: {
        composeEmailFromNote(note) {
            this.$router.push({
                path: '/mail/list',
                query: { tab: 'inbox', compose: 'new' }
            })
            setTimeout(() => {
                eventBus.emit('composeEmailWithNoteData', note)
            }, 600)
        },
        composeNoteFromEmail(email) {
            this.$router.push({
                path: '/keep/notes',
            })
            setTimeout(() => {
                eventBus.emit('composeNoteWithEmailData', email)
            }, 600)
        }

    }


}

const app = createApp(options)
app.use(router)
app.mount('#app')