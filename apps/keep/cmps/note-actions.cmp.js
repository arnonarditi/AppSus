import { svgService } from '../../../services/svg.service.js'

import colorPicker from './color-picker.cmp.js'

export default {
    name: 'note-actions',
    props: ['note'],
    template: `
    <section @click.stop.prevent class="item">
            <section class="note-actions flex">
                <div class="icon">
                    <img @click="trash" style="width:18px; height:18px" :src="getSvg('deleteForever')"/>
                </div>
                <div class="icon">
                    <img @click="colorPicker" style="width:18px; height:18px" :src="getSvg('colorPallet')"/>
                </div>
                <label>
                    <span class="icon">
                        <div class="icon" v-html="getSvg('img')"></div>
                    </span>
                    <input type="file" class="file-input btn" name="image" @change="updateImgUrl" style="display: none"/>
                </label>
                <div class="icon" @click="sendMail" v-html="getSvg('mail')"></div>
            </section>
            <color-picker v-if="isColorHidden" @updateColor="updateColor"/>
    </section>
        `,
    created() {},
    data() {
        return {
            isColorHidden: false,
        }
    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        trash() {
            this.$emit('update', 'isTrashed', true)
        },
        updateColor(toUpdate) {
            this.$emit('update', 'color', toUpdate);
        },
        updateImgUrl(ev) {
            this.$emit('updateImgUrl', ev)
        },
        colorPicker() {
            this.isColorHidden = !this.isColorHidden
        },
        sendMail() {
            this.$emit('sendMail')
        }
    },
    computed: {
        isHidden() {
            return this.isColorHidden
        }
    },
    components: {
        colorPicker,
    },
}