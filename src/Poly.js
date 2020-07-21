/**
 * @author Debonex
 * @fileoverview core data structure for PolyBG, generate svg
 */
import Delaunator from 'delaunator'
import * as domUtils from './utils/dom-utils'
import * as colorUtils from './utils/color-utils'
import * as randomUtils from './utils/random-utils'

export default class Poly {

    _init_color(option) {
        let color = this.OPTION.color
        let colorType = this.OPTION.color.type || 'liner'
        if (colorType == 'liner') {
            let directionX = color.directionX !== undefined ? color.directionX : 1
            let directionY = color.directionY !== undefined ? color.directionY : 0
            directionX = directionX > 0 ? 1 : (directionX == 0 ? 0 : -1)
            directionY = directionY > 0 ? 1 : (directionY == 0 ? 0 : -1)
            if (directionX == 0 && directionY == 0) directionX = directionY = 1
            let start = color.start || 'white'
            let end = color.end || 'black'
            let mode = color.mode || 'hsl'
            return colorUtils.xyMix(start, end,
                option.xRate * directionX,
                option.yRate * directionY, mode)
        } else if (colorType == 'circle') {
            let start = color.start || 'white'
            let end = color.end || 'black'
            let mode = color.mode || 'hsl'
            let r = Math.sqrt(Math.pow(option.xRate - 0.5, 2) + Math.pow(option.yRate - 0.5, 2))
            return colorUtils.rateTransition(start, end, r / Math.sqrt(2), mode)
        }
    }

    //#region square
    _init_square() {
            let size = this.OPTION.layout.size || 20
            let width = this.OPTION.width
            let height = this.OPTION.height
            let jRate = this.OPTION.layout.jitter || 0
            let rt, rb = [],
                lb = []
            let r = b => randomUtils.plainRndom(b, jRate, size)
            let l = (s, x, y) => [s, x, y].join(' ')
            let str
            for (let i = 0, y = 0; y < width + size; i++) {
                for (let j = 0, x = 0; x < height + size; j++) {
                    y = size * i
                    x = size * j
                    let d = ''
                    d += (j == 0 ?
                        (i == 0 ? l('M', r(x), r(y)) : l('M', lb[j][0], lb[j][1])) :
                        (l('M', rt[0], rt[1])))
                    rt = (i == 0 ? [r(x + size), r(y)] : [...rb[j]])
                    d += l('L', rt[0], rt[1])
                    rb[j] = [r(x + size), r(y + size)]
                    d += l('L', rb[j][0], rb[j][1])
                    lb[j] = (j == 0 ? [r(x), r(y + size)] : [...rb[j - 1]])
                    d += l('L', lb[j][0], lb[j][1])
                    d += 'Z'
                    let color = this._init_color({
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
            if (centoidX < 0) centoidX = 0.001
            if (centoidY < 0) centoidY = 0.001
            console.log(centoidX, centoidY)
            let color = this._init_color({
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
            let jRate = this.OPTION.layout.jitter || 0
            for (let x = 0; x < width + 2 * size; x += size) {
                for (let y = 0; y < height + 2 * size; y += size) {
                    points.push([randomUtils.plainRndom(x, jRate, size), randomUtils.plainRndom(y, jRate, size)])
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