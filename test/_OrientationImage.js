function getPx(value) {
    return value + 'px'
}

describe('OrientationImage.vue', function () {
    describe('transform style', function () {
        it('should add required CSS transform', function () {
            orientations.forEach(function (orientation) {
                var c = getComponent(OrientationImage, {
                    url: getImagePath(orientation),
                    orientation: orientation,
                })
                var expected = exif2css(orientation)
                // we have to set style on dummy element due to browser-specific values
                var el = document.createElement('div')
                el.style.transform = expected.transform
                el.style['-webkit-transform'] = expected.transform
                el.style['-ms-transform'] = expected.transform
                el.style['-webkit-transform-origin'] = expected['transform-origin']
                el.style['-ms-transform-origin'] = expected['transform-origin']
                el.style['transform-origin'] = expected['transform-origin']
                var parsedStyle = parseStyle(el)

                expect(c.jel.find('img')).toHaveCss(parsedStyle)
                // console.log(c.el)
            })
        })
    })
    describe('width and height', function () {
        describe('width', function () {
            var width = 300
            var expectedHeight = Math.round(width / aspect)

            it('should set dimensions given imageWidth and imageHeight', function () {
                orientations.forEach(function (orientation) {
                    var c = getComponent(OrientationImage, {
                        url: getImagePath(orientation),
                        orientation: orientation,
                        width: width,
                        imageWidth: getImageWidth(orientation),
                        imageHeight: getImageHeight(orientation),
                    })
                    expect(c.jel).toHaveCss({
                        width: getPx(width),
                        height: getPx(expectedHeight),
                    }, 'div' + orientation)
                    expect(c.jel.find('img')).toHaveCss({
                        width: orientation < 5 ? getPx(width) : getPx(expectedHeight),
                        height: orientation < 5 ? getPx(expectedHeight) : getPx(width),
                    }, 'img' + orientation)
                })
            })
            it('should set dimensions when image is loaded', function (done) {
                var loadedOrientations = []
                function loaded(orientation) {
                    loadedOrientations.push(orientation)
                    if (loadedOrientations.length === 8) {
                        done()
                    }
                }
                orientations.forEach(function (orientation) {
                    loadOrientationImage({
                        url: getImagePath(orientation),
                        orientation: orientation,
                        width: width,
                    }, function (c) {
                        expect(c.jel).toHaveCss({
                            width: getPx(width),
                            height: getPx(expectedHeight),
                        }, 'div' + orientation)
                        expect(c.jel.find('img')).toHaveCss({
                            width: orientation < 5 ? getPx(width) : getPx(expectedHeight),
                            height: orientation < 5 ? getPx(expectedHeight) : getPx(width),
                        }, 'img' + orientation)

                        loaded(orientation)
                    })
                })
            })
        })
        fdescribe('width and height', function () {
            var width = 500
            var height = 500

            it('should set both width and height', function () {
                orientations.forEach(function (orientation) {
                    var c = getComponent(OrientationImage, {
                        url: getImagePath(orientation),
                        orientation: orientation,
                        width: width,
                        height: height,
                        imageWidth: getImageWidth(orientation),
                        imageHeight: getImageHeight(orientation),
                    })
                    expect(c.jel).toHaveCss({
                        width: getPx(width),
                        height: getPx(expectedHeight),
                    }, 'div' + orientation)
                    expect(c.jel.find('img')).toHaveCss({
                        width: orientation < 5 ? getPx(width) : getPx(expectedHeight),
                        height: orientation < 5 ? getPx(expectedHeight) : getPx(width),
                    }, 'img' + orientation)
                })
            })
        })
        describe('height', function () {
            var height = 300
            var expectedWidth = Math.round(height * aspect)

            it('should set dimensions given imageWidth and imageHeight', function () {
                orientations.forEach(function (orientation) {
                    var c = getComponent(OrientationImage, {
                        url: getImagePath(orientation),
                        orientation: orientation,
                        height: height,
                        imageWidth: getImageWidth(orientation),
                        imageHeight: getImageHeight(orientation),
                    })
                    expect(c.jel).toHaveCss({
                        width: getPx(expectedWidth),
                        height: getPx(height),
                    }, 'div' + orientation)
                    expect(c.jel.find('img')).toHaveCss({
                        width: orientation < 5 ? getPx(expectedWidth) : getPx(height),
                        height: orientation < 5 ? getPx(height) : getPx(expectedWidth),
                    }, 'img' + orientation)
                })
            })
            it('should set dimensions when image is loaded', function (done) {
                var loadedOrientations = []
                function loaded(orientation) {
                    loadedOrientations.push(orientation)
                    if (loadedOrientations.length === 8) {
                        done()
                    }
                }
                orientations.forEach(function (orientation) {
                    loadOrientationImage({
                        url: getImagePath(orientation),
                        orientation: orientation,
                        height: height,
                    }, function (c) {
                        expect(c.jel).toHaveCss({
                            width: getPx(expectedWidth),
                            height: getPx(height),
                        }, 'div' + orientation)
                        expect(c.jel.find('img')).toHaveCss({
                            width: orientation < 5 ? getPx(expectedWidth) : getPx(height),
                            height: orientation < 5 ? getPx(height) : getPx(expectedWidth),
                        }, 'img' + orientation)

                        loaded(orientation)
                    })
                })
            })

            fdescribe('parent element', function () {
                var innerEl
                var el
                beforeAll(function () {
                    el = document.createElement('div')
                    el.style.width = '1000px'
                    el.style.height = '450px'
                    document.body.appendChild(el)
                })
                afterAll(function () {
                    document.body.removeChild(el)
                })

                beforeEach(function () {
                    innerEl = document.createElement('div')
                    el.appendChild(innerEl)
                })

                orientations.forEach(function (orientation) {
                    it('should set dimensions (' + orientation + ')', function (done) {
                        console.log('----')
                        loadOrientationImage({
                            url: getImagePath(orientation),
                            orientation: orientation,
                            height: height,
                            useParentWidthAndHeight: true,
                        }, innerEl, function (c) {
                            console.log(c.el)
                            done()
                        })
                        // var c = getComponent(OrientationImage, {
                        //     url: getImagePath(orientation),
                        //     orientation: orientation,
                        //     height: height,
                        //     useParentWidthAndHeight: true,
                        // }, innerEl)
                        // Vue.nextTick(function () {
                        //     console.log(123)
                        //     console.log(c.el)
                        //     done()
                        // })
                    })
                })

                afterEach(function () {
                    el.innerHTML = ''
                })
            })
            // fit('should set dimensions of parent element', function (done) {
            //     orientations.forEach(function (orientation) {

            //         console.log('----')

            //         var c = getComponent(OrientationImage, {
            //             url: getImagePath(orientation),
            //             orientation: orientation,
            //             height: height,
            //             useParentWidthAndHeight: true,
            //         }, innerEl)

            //         Vue.nextTick(function () {
            //             console.log(123)
            //             done()
            //         })
            //         el.removeChild(c.el)
            //         // Vue.nextTick(function () {
            //         //     console.log(123, el, c.el)
            //         //     done()
            //         // })
            //         // expect(c.jel).toHaveCss({
            //         //     width: getPx(expectedWidth),
            //         //     height: getPx(height),
            //         // }, 'div' + orientation)
            //         // expect(c.jel.find('img')).toHaveCss({
            //         //     width: orientation < 5 ? getPx(expectedWidth) : getPx(height),
            //         //     height: orientation < 5 ? getPx(height) : getPx(expectedWidth),
            //         // }, 'img' + orientation)
            //     })
            // })
        })
    })
    describe('loading', function () {
        var c
        var loadingClass = 'loading'

        beforeEach(function () {
            c = getComponent(OrientationImage, {
                url: '/img/8.jpg',
                orientation: 8,
                loadingClass: loadingClass,
            })
        })

        it('should not display image until it is loaded', function () {
            expect(c.jel.find('img')).toHaveCss({ display: 'none' })
        })
        it('should display image when loaded', function (done) {
            c.vm.$on('loaded', function () {
                Vue.nextTick(function () {
                    expect(c.jel.find('img')).not.toHaveCss({ display: 'none' })
                    done()
                })
            })
        })
        it('should add loading class to the div if specified', function () {
            expect(c.jel).toHaveClass(loadingClass)
        })
        it('should remove loading class from the div', function (done) {
            c.vm.$on('loaded', function () {
                Vue.nextTick(function () {
                    expect(c.jel).not.toHaveClass(loadingClass)
                    done()
                })
            })
        })
    })
})
