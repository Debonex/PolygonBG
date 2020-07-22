/**
 * @author Debonex
 * @fileoverview some operations for dom objects
 * @date 2020年7月22日16:12:31
 */

export const makeNode = function (tag, attrs, children) {
    let root = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for (let attr in attrs) {
        attrs[attr] && (root.setAttribute(attr, attrs[attr]))
    }
    children && children.forEach(child => {
        root.appendChild(child)
    })
    return root
}

export const computeCentoidByd = function (path) {
    if (path.hasAttribute('d')) {
        let state = 0
        let point = Array(2)
        let cnt = 0
        let x = 0, y = 0
        path.getAttribute('d').split(' ').forEach(e => {
            if (parseFloat(e).toString() != 'NaN') {
                switch (state % 2) {
                    case 0:
                        point[0] = e
                        break
                    case 1:
                        point[1] = e
                        x += Number(point[0])
                        y += Number(point[1])
                        cnt++
                        break
                }
                state++
            }
        })
        if (cnt == 0) {
            throw TypeError('path resolve error.')
        }
        else {
            return [x / cnt, y / cnt]
        }
    }
    else throw TypeError('path resolve error.')
}