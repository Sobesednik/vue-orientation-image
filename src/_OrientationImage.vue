<template>
    <div :style="divStyle" :class="divClass">
        <img @load="onImgLoad" :style="imgStyle" :src="url"></div>
    </div>
</template>

<script>
    import exif2css from 'exif2css'

    function getCssDimension(value) {
        return `${value}px`
    }

    export default {
        computed: {
            // http://sylvana.net/jpegcrop/exif_orientation.html
            // http://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
            doRotate() {
                // console.log('1 do rotate')
                return this.exifOrientation > 4
            },
            virtualWidth() {
                // console.log('2 virutal width')
                return this.doRotate ? this.naturalHeight : this.naturalWidth
            },
            virtualHeight() {
                // console.log('3 virutal height')
                return this.doRotate ? this.naturalWidth : this.naturalHeight
            },
            aspect() {
                // console.log('4 aspect')
                return this.virtualWidth / this.virtualHeight
            },
            divHeight() {
                // console.log('5 div height')
                const maxHeightFromWidth = (this.maxWidth && this.aspect) ? this.maxWidth / this.aspect : undefined
                if (this.maxHeight && maxHeightFromWidth && this.maxHeight > maxHeightFromWidth) {
                    return getCssDimension(this.round(maxHeightFromWidth))
                }
                if (this.maxHeight) {
                    return getCssDimension(this.round(this.maxHeight))
                }
            },
            divWidth() {
                // console.log('6 div width')
                const maxWidthFromHeight = (this.maxHeight && this.aspect) ? this.maxHeight * this.aspect : undefined
                if (this.maxWidth && maxWidthFromHeight && this.maxWidth > maxWidthFromHeight) {
                    return getCssDimension(this.round(maxWidthFromHeight))
                }
                if (this.maxWidth) {
                    return getCssDimension(this.round(this.maxWidth))
                }
            },
            maxHeight() {
                // console.log('7 max height')
                if (this.height) {
                    return this.height
                }
                if (this.width && this.aspect) {
                    return this.width / this.aspect
                }
                if (this.parentHeight) {
                    return this.parentHeight
                }
                if (this.virtualHeight) {
                    return this.virtualHeight
                }
            },
            maxWidth() {
                console.log('8 max width')
                if (this.width) {
                    console.log('using width')
                    return this.width
                }
                if (this.height && this.aspect) {
                    console.log('using calculated width')
                    return this.height * this.aspect
                }
                if (this.parentWidth) {
                    console.log('using parent width')
                    return this.parentWidth
                }
                if (this.virtualWidth) {
                    return this.virtualWidth
                }
            },
            imgStyle() {
                // console.log('9 img style')
                const css = exif2css(this.exifOrientation)
                const style = {
                    width: this.doRotate ? this.divHeight : this.divWidth,
                    height: this.doRotate ? this.divWidth : this.divHeight,
                    '-webkit-transform': css.transform,
                    '-ms-transform': css.transform,
                    transform: css.transform,
                    '-webkit-transform-origin': css['transform-origin'],
                    '-ms-transform-origin': css['transform-origin'],
                    'transform-origin': css['transform-origin'],
                    position: 'absolute', // avoid scroll due to rotation
                    left: 0,
                    top: 0,
                }
                if (this.loading) {
                    style.display = 'none'
                }
                return style
            },
            divStyle() {
                // console.log('10 div style')
                return {
                    width: this.divWidth,
                    height: this.divHeight,
                    position: 'relative',
                }
            },
            divClass() {
                // console.log('11 div class')
                // { [loadingClass]: this.loading }
                if (this.loadingClass) {
                    const cl = {}
                    cl[this.loadingClass] = this.loading
                    return cl
                }
            },
            naturalWidth() {
                // console.log('12 natural width')
                if (this.imageWidth) {
                    return this.imageWidth
                }
                if (this.loadedWidth) {
                    return this.loadedWidth
                }
            },
            naturalHeight() {
                // console.log('13 natural height')
                if (this.imageHeight) {
                    return this.imageHeight
                }
                if (this.loadedHeight) {
                    return this.loadedHeight
                }
            },
            exifOrientation() {
                // console.log('14 orientation')
                if (this.orientation) {
                    return this.orientation
                }
                if (this.loadedOrientation) {
                    return this.loadedOrientation
                }
            },
            loading() {
                // console.log('15 loading')
                return !(this.naturalWidth && this.naturalHeight && this.exifOrientation)
            },
        },
        watch: {
            loading(newValue) {
                if (newValue === false) {
                    this.$emit('loaded')
                }
            }
        },
        mounted() {
            console.log('mounted')
            if (this.useParentWidthAndHeight) {
                this.computeParentWidthAndHeight()
            }
        },
        props: {
            width: { type: Number },
            height: { type: Number },
            imageWidth: { type: Number },
            imageHeight: { type: Number },
            orientation: { type: Number },
            url: { type: String },
            loadingClass: { type: String },
            exifFn: { type: Function },
            useParentWidthAndHeight: { type: Boolean, default: false }
        },
        data() {
            return {
                loadedWidth: null,
                loadedHeight: null,
                loadedOrientation: null,
                parentWidth: null,
                parentHeight: null,
            }
        },
        methods: {
            onImgLoad(event) {
                const image = event.target
                this.loadedWidth = image.naturalWidth
                this.loadedHeight = image.naturalHeight

                if (!this.exifOrientation && typeof this.exifFn === 'function') {
                    this.exifFn(image, (orientation) => {
                        this.loadedOrientation = orientation
                    })
                } else if (!this.exifOrientation) {
                    // cannot get orientation
                    this.loadedOrientation = 1
                }
            },
            computeParentWidthAndHeight() {
                console.log('compute')
                console.log(this.$el.parentElement)
                if (this.$el && this.$el.parentElement) {
                    console.log('do compute')
                    const el = this.$el.parentElement
                    const cs = getComputedStyle(el)

                    const paddingRight = parseInt(cs.getPropertyValue('padding-right'), 10) || 0
                    const paddingLeft = parseInt(cs.getPropertyValue('padding-left'), 10) || 0
                    const paddingTop = parseInt(cs.getPropertyValue('padding-top'), 10) || 0
                    const paddingBottom = parseInt(cs.getPropertyValue('padding-bottom'), 10) || 0

                    this.parentWidth = el.clientWidth - paddingLeft - paddingRight
                    this.parentHeight = el.clientHeight - paddingTop - paddingBottom
                    console.log(this.parentWidth, this.parentHeight)
                }
            },
            round(value) {
                return Math.round(value)
            }
        },
    }
</script>
