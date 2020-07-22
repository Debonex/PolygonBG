/**
 * @author Debonex
 * @fileoverview core data structure for PolyBG, generate svg
 * @date 2020年7月22日16:11:51
 */

import * as domUtils from './utils/dom-utils'
import * as colorUtils from './utils/color-utils'
import {generatePaths} from './paths'

export default class Poly {

    /**
     * Create a Poly object. Poly object contains children for generating a svg.
     * 1. generate paths. only with attribute 'd'.
     * 2. add attribute 'fill' to children.
     * 3. add some attributes, which will affect interactive appearance of paths. (./css/poly.css).
     * @param {*} option 
     */
    constructor(option) {
        Poly.polyCode += 1
        this.option = option
        this.children = []
        this.id = '_poly_' + Poly.polyCode
        generatePaths(option, this.children)
        generateFills(option, this.children)
        generateHovers(option, this.children)
    }

    /**
     * Generate a svg (dom element)
     */
    generateSVG() {
        let svg = domUtils.makeNode('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            height: this.option.height,
            width: this.option.width,
            id: this.id
        }, this.children)
        return svg
    }
}
Poly.polyCode = 0

const generateFills = function (option, children) {
    let color = option.color
    let colorType = color.type || 'liner'
    let scale = color.scale || ['white', 'black']
    if (scale.length == 1) scale.push('gray')
    let mode = color.mode || 'hsl'
    let width = option.width
    let height = option.height

    let colorFunc
    if (colorType == 'liner') {
        colorFunc = function (xRate, yRate) {
            let directionX = color.directionX !== undefined ? color.directionX : 1
            let directionY = color.directionY !== undefined ? color.directionY : 0
            directionX = directionX > 0 ? 1 : (directionX == 0 ? 0 : -1)
            directionY = directionY > 0 ? 1 : (directionY == 0 ? 0 : -1)
            if (directionX == 0 && directionY == 0) directionX = directionY = 1
            return colorUtils.xyMix(scale,
                xRate * directionX,
                yRate * directionY, mode)
        }
    }
    else if (colorType == 'circle') {
        colorFunc = function (xRate, yRate) {
            let r = Math.sqrt(Math.pow(xRate - 0.5, 2) + Math.pow(yRate - 0.5, 2))
            return colorUtils.rateTransition(scale, r / Math.sqrt(2), mode)
        }
    }

    for (let i = 0; i < children.length; i++) {
        let centoid = domUtils.computeCentoidByd(children[i])
        if (centoid[0] < 0) centoid[0] = 0.001
        if (centoid[1] < 0) centoid[1] = 0.001
        let [xRate, yRate] = [centoid[0] / width, centoid[1] / height]
        children[i].setAttribute('fill', colorFunc(xRate, yRate))
    }
}

const generateHovers = function (option, children) {
    let hover = option.hover
    let hoverFillFunc;
    if(hover.color == 'trans'){
        hoverFillFunc = c => colorUtils.colorContract(c.getAttribute('fill'))
    }else{
        let hoverFillHex = colorUtils.color(hover.color)
        hoverFillFunc = () => hoverFillHex
    }
    for (let i = 0; i < children.length; i++) {
        let hoverFill = hoverFillFunc(children[i])
        children[i].style.setProperty('--hoverfill', hoverFill)
        children[i].setAttribute('hover', 'true')
    }
}