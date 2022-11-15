import { svgService } from '../../../services/svg.service.js'

export default {
    name: 'note-canvas',
    props: ['info', 'isDetails'],
    template: `
        <div v-if="isDetails" ref="canvasContainer" class="canvas-container">
            <canvas ref="canvas" class="canvas" height="450" width="300" @click="draw"></canvas>
            <!-- <button @click="save">Save</button> -->
            <section class="action-container flex">
            <label>
                <div className="icon" v-html="getSvg('paint')"></div>
                <input type="color" @input="changeColor($event)" style="display: none"/>
            </label>
            <div @click="eraseCanvas" className="icon" v-html="getSvg('colorPickerNone')"></div>
            </section>
        </div>
        `,
    components: {},
    created() {},
    data() {
        return {
            touchEvents: ['touchstart', 'touchmove', 'touchend'],
            elCanvas: null,
            ctx: null,
            isClicked: false,
            imgUrl: null,
            color: '#000000'
        }
    },
    methods: {
        initCanvas() {
            if (!this.isDetails) return
            this.elCanvas = this.$refs.canvas
            this.ctx = this.elCanvas.getContext('2d')

            this.resizeCanvas()
            this.addListeners()

            // if (!this.isDetails) this.eraseCanvas()
            if (this.info.canvasUrl) this.drawCanvas()
            else this.eraseCanvas()
        },
        addListeners() {
            this.addMouseListeners()
            this.addTouchListeners()

            window.addEventListener('resize', () => {
                this.resizeCanvas()
            })
        },
        resizeCanvas() {
            const elContainer = this.$refs.canvasContainer
            this.elCanvas.width = elContainer.offsetWidth - 20
            this.elCanvas.height = elContainer.offsetHeight - 50
        },
        addMouseListeners() {
            this.elCanvas.addEventListener('mousemove', this.draw)
            this.elCanvas.addEventListener('mousedown', this.onDown)
            this.elCanvas.addEventListener('mouseup', this.onUp)
        },
        addTouchListeners() {
            this.elCanvas.addEventListener('touchmove', this.draw)
            this.elCanvas.addEventListener('touchstart', this.onDown)
            this.elCanvas.addEventListener('touchend', this.onUp)
        },
        onDown(ev) {
            this.isClicked = true
            this.ctx.strokeStyle = this.color
            this.draw(ev)
        },
        onUp() {
            this.isClicked = false
            this.ctx.stroke()
            this.ctx.beginPath()
            this.save()
        },
        draw(ev) {
            if (!this.isClicked) return
            this.ctx.lineWidth = 3
            this.ctx.lineCap = 'round'

            if (this.touchEvents.includes(ev.type)) {
                ev.preventDefault()
                ev = ev.changedTouches[0]

                this.ctx.lineTo(ev.pageX - ev.target.offsetLeft - ev.target.clientLeft, ev.pageY - ev.target.offsetTop - ev.target.clientTop)
            } else this.ctx.lineTo(ev.offsetX, ev.offsetY)

            this.ctx.stroke()
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        changeColor(ev) {
            this.color = ev.target.value
        },
        drawCanvas() {
            var image = new Image();
            image.src = this.info.canvasUrl
            this.ctx.drawImage(image, 0, 0, this.elCanvas.width, this.elCanvas.height)
            console.log(this.ctx);
        },
        eraseCanvas() {
            this.ctx.fillStyle = '#fdf3f6'
            this.ctx.fillRect(0, 0, this.elCanvas.width, this.elCanvas.height);
            this.save()
        },
        save() {
            this.imgUrl = this.elCanvas.toDataURL("image/jpeg")
            this.$emit('update', 'canvasUrl', this.imgUrl)
        }
    },
    computed: {},
    mounted() {
        this.initCanvas()
    },
}