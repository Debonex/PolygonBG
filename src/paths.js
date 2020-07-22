/***
 * @author Debonex
 * @fileoverview Generate path items
 * @date 2020年7月22日16:35:56
 */

import Delaunator from 'delaunator'
import * as randomUtils from './utils/random-utils'
import * as domUtils from './utils/dom-utils'

export const generatePaths = function (option, children) {
    let layout = option.layout
    let type = layout.type
    let size = layout.size || 20
    let width = option.width
    let height = option.height
    let jRate = option.layout.jitter || 0

    let l = (s, x, y) => [s, x, y].join(' ')
    if (type == 'square') {
        let rt, rb = [],
            lb = []
        let r = b => randomUtils.plainRndom(b, jRate, size)
        for (let i = 0, y = 0; y < width + size; i++) {
            for (let j = 0, x = 0; x < height + size; j++) {
                y = size * i
                x = size * j
                let d = ''
                d += (j == 0 ?
                    (i == 0 ? l(' M', r(x), r(y)) : l(' M', lb[j][0], lb[j][1])) :
                    (l(' M', rt[0], rt[1])))
                rt = (i == 0 ? [r(x + size), r(y)] : [...rb[j]])
                d += l(' L', rt[0], rt[1])
                rb[j] = [r(x + size), r(y + size)]
                d += l(' L', rb[j][0], rb[j][1])
                lb[j] = (j == 0 ? [r(x), r(y + size)] : [...rb[j - 1]])
                d += l(' L', lb[j][0], lb[j][1])
                d += ' Z'
                children.push(domUtils.makeNode('path', { d: d }))
            }
        }
    }

    else if (type == 'triangle') {
        let points = []
        for (let x = 0; x < width + 2 * size; x += size) {
            for (let y = 0; y < height + 2 * size; y += size) {
                points.push([randomUtils.plainRndom(x, jRate, size), randomUtils.plainRndom(y, jRate, size)])
            }
        }
        let triangles = Delaunator.from(points).triangles
        for (let i = 0; i < triangles.length; i += 3) {
            let d = ''
            let triangle = []
            triangles.slice(i, i + 3).map(idx => triangle.push([points[idx][0], points[idx][1]]))
            d += ' M ' + triangle[0][0] + ' ' + triangle[0][1]
            d += ' L ' + triangle[1][0] + ' ' + triangle[1][1]
            d += ' L ' + triangle[2][0] + ' ' + triangle[2][1]
            d += ' Z'
            children.push(domUtils.makeNode('path', { d: d }))
        }
    }
}