<template>
    <img v-if="!metaLoaded" :src="url" style="display: none" @load="metaLoadedListener">
    <img v-else-if="!svgLoaded" @load="svgLoadedListener" :src="svgSrc">
    <img v-else :src="url" :style="imgStyle">
</template>

<script>

    /*
     * At firts, this component will place an img tag with svg with virutual (rotated) width and height of an image
     * to see what display rectangle it will occupy according to CSS rules. After that, the svg is replaced
     * with an actual image, and if it has to be rotated, the width and height are set to the calculated ones.
     * The image is rotated and scaled with CSS transform rules, making it appear as if with normal orientation.
     *
     * If image width, height and orientation are not given to the component, the image will be loaded
     * first to access its `naturalWidth` and `naturalHeight` properties. If _exif_ function is given (e.g., from
     * exif-js), it will be used to get orientation. When width, height and orientation are available, all required
     * data is complete, and the component logic will be performed.
     *
     * @see http://sylvana.net/jpegcrop/exif_orientation.html
     * @see http://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
     */

    import exif2css from 'exif2css'

    export default {
        computed:{
            svgSrc() {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.virtualWidth}" height="${this.virtualHeight}" />`
                const encoded = encodeURI(svg)
                return `data:image/svg+xml,${encoded}`
            },
            scaleX() {
                return this.doRotate ? `scaleX(${this.naturalHeight / this.naturalWidth})` : null
            },
            scaleY() {
                return this.doRotate ? `scaleY(${this.naturalWidth / this.naturalHeight})` : null
            },
            imgStyle() {
                return {
                    width: this.doRotate ? `${this.svgWidth}px` : null,
                    height: this.doRotate ? `${this.svgHeight}px` : null,
                    '-webkit-transform': this.transform,
                    '-ms-transform': this.transform,
                    transform: this.transform,
                    '-webkit-transform-origin': this.transformOrigin,
                    '-ms-transform-origin': this.transformOrigin,
                    'transform-origin': this.transformOrigin,
                }
            },
            exif2css() {
                return exif2css(this.exifOrientation)
            },
            transform() {
                if (this.exif2css && this.exif2css.transformStrings) {
                    const res = []
                    if (this.exif2css.transformStrings.translateX) {
                        res.push(this.exif2css.transformStrings.translateX)
                    }
                    if (this.exif2css.transformStrings.translateY) {
                        res.push(this.exif2css.transformStrings.translateY)
                    }
                    if (this.scaleX) {
                        res.push(this.scaleX)
                    }
                    if (this.scaleY) {
                        res.push(this.scaleY)
                    }
                    if (this.exif2css.transformStrings.rotate) {
                        res.push(this.exif2css.transformStrings.rotate)
                    }
                    if (this.exif2css.transformStrings.rotateY) {
                        res.push(this.exif2css.transformStrings.rotateY)
                    }
                    return res.join(' ')
                }
            },
            transformOrigin() {
                return this.exif2css ? this.exif2css['transform-origin'] : null
            },
            doRotate() {
                return this.exifOrientation > 4
            },
            virtualWidth() {
                return this.doRotate ? this.naturalHeight : this.naturalWidth
            },
            virtualHeight() {
                return this.doRotate ? this.naturalWidth : this.naturalHeight
            },
            naturalWidth() {
                if (this.imageWidth) {
                    return this.imageWidth
                }
                if (this.loadedWidth) {
                    return this.loadedWidth
                }
            },
            naturalHeight() {
                if (this.imageHeight) {
                    return this.imageHeight
                }
                if (this.loadedHeight) {
                    return this.loadedHeight
                }
            },
            exifOrientation() {
                if (this.orientation) {
                    return this.orientation
                }
                if (this.loadedOrientation) {
                    return this.loadedOrientation
                }
            },
            metaLoaded() {
                return this.naturalWidth !== undefined && this.naturalHeight !== undefined && this.exifOrientation !== undefined
            },
        },
        methods: {
            metaLoadedListener(event) {
                console.log('meta loaded')
                const img = event.target
                this.loadedWidth = img.naturalWidth
                this.loadedHeight = img.naturalHeight
            },
            svgLoadedListener(event) {
                console.log('svg loaded')
                const img = event.target
                this.svgWidth = img.width
                this.svgHeight = img.height
                this.svgLoaded = true
            },
        },
        data() {
            return {
                svgLoaded: false,
                svgWidth: null,
                svgHeight: null,
                loadedWidth: null,
                loadedHeight: null,
                loadedOrientation: null,
            }
        },
        props: [
            'imageWidth',
            'imageHeight',
            'orientation',
            'url',
            'loadingClass',
            'exifFn',
        ],
    }
</script>
