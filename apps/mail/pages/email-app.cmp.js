//main-emailApp
//import components
import emailFilter from '../cmps/email-filter.cmp.js'
import emailFolderList from '../cmps/email-folder-list.cmp.js'

import emailList from './email-list.cmp.js'
import emailDetails from './email-details.cmp.js'

export default {
    name: 'email-app',
    props: [],
    template: `

    <section class="email-app flex full-height">
        <email-folder-list></email-folder-list>
        <div class="main-content">
            <email-filter></email-filter>
        <!-- list,details -->
            <router-view>
                 </router-view>
        </div>

    </section>
        `,
    data() {
        return {
           
        }
    },
    components: {
        emailFilter,
        emailFolderList,
        emailList,
        emailDetails
    }
}