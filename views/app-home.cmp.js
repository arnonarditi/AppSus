export default {
    template: `
        <!-- <section class="home-page flex space-even">
        <router-link to="/mail/list?tab=inbox">
            <div class="gmail-wrapper">
                <img  :src="gmailUrl" alt="" />
            </div>
        </router-link>

        <router-link to="/keep/notes">
            <div class="keep-wrapper">
                <img :src="keepUrl" alt="" />
            </div>
        </router-link>

        </section> -->
        <section class="page-container">
            <section class="content-container">
                <h1>Secure, smart, and easy to use our apps</h1>
                <p>Get more done with Gmail or Save your thoughts, wherever you are with google Keep</p>

                <section class="btn-container">
                    <span class="router-btn">
                        <router-link to="/mail/list?tab=inbox">
                            {{ 'Start Gmail' }}
                        </router-link>
                    </span>
                    
                    <span class="router-btn">
                        <router-link to="/keep/notes">
                            {{ 'Start Google Keep' }}
                        </router-link>
                    </span>
                </section>
            </section>
            <section class="img-container">
                <img src="assets/img/googleHome.webp" />
            </section>
        </section>
    `,
    data() {
        return {
            gmailUrl: 'assets/img/gmailLogo.png',
            keepUrl: 'assets/img/keepLogo.png'
        }
    }
}