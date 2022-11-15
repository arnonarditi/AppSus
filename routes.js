import homePage from './views/app-home.cmp.js'
import aboutPage from './views/app-about.cmp.js'

import keepPage from './apps/keep/pages/note-index.cmp.js'
import keepNotes from './apps/keep/pages/keep-notes.cmp.js'
import keepTrash from './apps/keep/pages/keep-trash.cmp.js'
import noteDetails from './apps/keep/pages/note-details.cmp.js'

import emailApp from './apps/mail/pages/email-app.cmp.js'
import emailList from './apps/mail/pages/email-list.cmp.js'
import emailDetails from './apps/mail/pages/email-details.cmp.js'


const { createRouter, createWebHashHistory } = VueRouter

const routerOptions = {
    history: createWebHashHistory(),
    routes: [{
            path: '/',
            component: homePage,
        },
        {
            path: '/about',
            component: aboutPage,
        },
        {
            path: '/mail',
            component: emailApp,
            name: 'email-app',
            children: [{
                    path: '/mail/list',
                    component: emailList
                },
                {
                    path: '/mail/list/:id',
                    component: emailDetails
                },
            ]

        },
        {
            path: '/keep',
            component: keepPage,
            name: 'keep',
            children: [{
                    path: '/keep/notes',
                    component: keepNotes,
                    name: 'keep-notes',
                    children: [{
                        path: '/keep/notes/:id',
                        component: noteDetails,
                        props: true,
                        name: 'note-details'
                    }]
                },
                {
                    path: '/keep/trash',
                    component: keepTrash,
                    name: 'keep-trash'
                },
            ]
        },
    ],
}

export const router = createRouter(routerOptions)