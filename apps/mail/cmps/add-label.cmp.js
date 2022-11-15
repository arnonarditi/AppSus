import { eventBus } from "../../../services/event-bus.service.js"
import { svgService } from '../../../services/svg.service.js'

export default {
    props: [],
    template: `
<section v-if="isAddLabel" className="add-label flex column space-even">
    <div class="flex space-between align-center">
        <h2>New label</h2>
        <img @click="cancelLabeling" style="width:20px; height:20px" 
        :src="getMailSvg('button1')" alt="" />

    </div>
    <div class="flex column">
        <span>Please enter a new label name:</span>
        <input type="text" v-model="labelName" />
    </div>
    <div class="action-btns flex ">
        <button @click="cancelLabeling">Cancel</button>
        <button class="create-btn" @click="createLabel">Create</button>

    </div>
  
</section>
`,
    data() {
        return {
            labelName: '',
            isAddLabel: true
        }
    },
    methods: {
        cancelLabeling() {
            this.isAddLabel = false
            eventBus.emit('cancelLabeling', false)
        },
        createLabel() {
            eventBus.emit('createLabel', this.labelName)
            this.isAddLabel = false
        },
        getMailSvg(iconName) {
            return svgService.getMailSvg(iconName)
        },
    },
}