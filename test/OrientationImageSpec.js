const Vue = require('vue')
const OrientationImage = require('../src/OrientationImage.vue');

const exif2css = require('exif2css')

function getComponent(Component, propsData, element) {
    var Ctor = Vue.extend(Component)
    var vm = new Ctor({ propsData: propsData }).$mount(element)
    return {
        vm: vm,
        el: vm.$el,
        jel: $j(vm.$el),
    }
}

function exifFn(image, cb) {
    var map = {
        '/img/1.jpg': 1,
        '/img/2.jpg': 2,
        '/img/3.jpg': 3,
        '/img/4.jpg': 4,
        '/img/5.jpg': 5,
        '/img/6.jpg': 6,
        '/img/7.jpg': 7,
        '/img/8.jpg': 8,
    }
    cb(map(image))
}

var orientations = []
for (var i = 1; i < 9; i++ ){
    orientations.push(i)
}
var normalOrientations = orientations.slice(0, 4)
var rotatedOrientations = orientations.slice(4, 8)

// virtual width and height (after rotation)
var imgWidth = 334
var imgHeight = 500

// virtual width and height
var aspect = imgWidth / imgHeight

// real width and height (of file)
function getImageWidth(orientation) {
    return orientation < 5 ? imgWidth : imgHeight
}
function getImageHeight(orientation) {
    return orientation < 5 ? imgHeight : imgWidth
}

function loadOrientationImage(props, element, cb) {
    var c = getComponent(OrientationImage, props, element)
    c.vm.$on('loaded', function () {
        Vue.nextTick(cb.bind(null, c))
    })
}

function getImagePath(orientation) {
    return '/img/' + orientation + '.jpg'
}


function parseStyle(el) {
    var style = $j(el).attr('style')
    var parsedStyle = style === undefined ? {} : style
        .split(';')
        .map(function(value) { return value.trim() })
        .filter(function(value) { return value !== '' })
        .reduce(function(parsedObject, currentValue) {
            var splitStyle = currentValue.split(':')
            parsedObject[splitStyle[0]] = splitStyle[1].trim()
            return parsedObject
        }, {})
}

describe('OrientationImage.vue', function () {
    describe('transform style', function () {
        it('should add required CSS transform', function () {
            var orientation = 6
            var c = getComponent(OrientationImage, {
                url: getImagePath(orientation),
                orientation: orientation,
            })
            document.body.appendChild(c.el)
            // orientations.forEach(function (orientation) {
            //     var c = getComponent(OrientationImage, {
            //         url: getImagePath(orientation),
            //         orientation: orientation,
            //     })
            //     var expected = exif2css(orientation)
            //     // we have to set style on dummy element due to browser-specific values
            //     var el = document.createElement('div')
            //     el.style.transform = expected.transform
            //     el.style['-webkit-transform'] = expected.transform
            //     el.style['-ms-transform'] = expected.transform
            //     el.style['-webkit-transform-origin'] = expected['transform-origin']
            //     el.style['-ms-transform-origin'] = expected['transform-origin']
            //     el.style['transform-origin'] = expected['transform-origin']
            //     var parsedStyle = parseStyle(el)

            //     expect(c.jel.find('img')).toHaveCss(parsedStyle)
            //     // console.log(c.el)
            // })
        })
    })
})
