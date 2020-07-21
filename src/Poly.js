/**
 * @author Debonex
 * @fileoverview core data structure for PolyBG, generate svg
 */
import Delaunator from 'delaunator'
import * as domUtils from './utils/dom-utils'
import * as colorUtils from './utils/color-utils'

export default class Poly {

    _init_color(colorType, option) {
        let color = this.OPTION.color
        if (colorType == 'liner') {
            let directionX = color.directionX !== undefined ? color.directionX : 1
            let directionY = color.directionY !== undefined ? color.directionY : 0
            directionX = directionX > 0 ? 1 : (directionX == 0 ? 0 : -1)
            directionY = directionY > 0 ? 1 : (directionY == 0 ? 0 : -1)
            if (directionX == 0 && directionY == 0) {
                throw TypeError('Can\'t set both diretions to 0.')
            }
            let start = color.start || 'white'
            let end = color.end || 'black'
            let mode = color.mode || 'hsl'
            return colorUtils.xyMix(start, end,
                option.xRate * directionX,
                option.yRate * directionY, mode)
        }
    }

    //#region square
    _init_square() {
        let size = this.OPTION.layout.size || 20
        let width = this.OPTION.width
        let height = this.OPTION.height
        for (let x = 0; x < width + size; x += size) {
            for (let y = 0; y < height + size; y += size) {
                let d = ''
                d += 'M' + x + ' ' + y
                d += 'L' + (x + size) + ' ' + y
                d += 'L' + (x + size) + ' ' + (y + size)
                d += 'L' + x + ' ' + (y + size)
                d += 'Z'
                let color = this._init_color('liner', {
                    xRate: (x + size / 2) / this.OPTION.width,
                    yRate: (y + size / 2) / this.OPTION.height
                })
                this._children.push(domUtils.makeNode('path', {
                    d: d,
                    fill: color
                }))
            }
        }
    }
    //#endregion

    //#region triangle
    _init_triangle() {
        let points = this._points_triangle()
        let triangles = Delaunator.from(points).triangles
        for (let i = 0; i < triangles.length; i += 3) {
            let d = ''
            let triangle = []
            triangles.slice(i, i + 3).map(idx => triangle.push([points[idx][0], points[idx][1]]))
            d += 'M' + triangle[0][0] + ' ' + triangle[0][1]
            d += 'L' + triangle[1][0] + ' ' + triangle[1][1]
            d += 'L' + triangle[2][0] + ' ' + triangle[2][1]
            d += 'Z'

            let centoidX = 0
            let centoidY = 0
            triangle.forEach(p => {
                centoidX += p[0]
                centoidY += p[1]
            })
            centoidX /= 3
            centoidY /= 3
            let color = this._init_color('liner', {
                xRate: centoidX / this.OPTION.width,
                yRate: centoidY / this.OPTION.height
            })
            this._children.push(domUtils.makeNode('path', {
                d: d,
                fill: color
            }))
        }
    }

    _points_triangle() {
        let size = this.OPTION.layout.size || 20
        let width = this.OPTION.width
        let height = this.OPTION.height
        let points = []
        for (let x = 0; x < width + size; x += size) {
            for (let y = 0; y < height + size; y += size) {
                points.push([x, y])
            }
        }
        return points
    }
    //#endregion

    constructor(option) {
        this.OPTION = option

        this._children = []
        switch (option.layout.type) {
            case 'triangle':
                this._init_triangle()
                break
            case 'square':
                this._init_square()
                break
        }
    }

    generateSVG() {
        return domUtils.makeNode('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            height: this.OPTION.height,
            width: this.OPTION.width
        }, this._children, this.OPTION.id)
    }

}