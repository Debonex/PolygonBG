/**
 * @author Debonex
 * @fileoverview some color operations implemented with chroma
 * @date 2020年7月22日16:12:49
 */
import chroma from 'chroma-js'

export const xyMix = function (s, x, y, mode) {
    let scale = chroma.scale(s).mode(mode)
    x = x + (x >= 0 ? 0 : 1)
    y = y + (y >= 0 ? 0 : 1)
    if (x == 0) {
        return scale(y)
    } else if (y == 0) {
        return scale(x)
    } else {
        return chroma.mix(scale(x), scale(y), 0.5, mode)
    }
}

export const rateTransition = function (s, rate, mode) {
    let scale = chroma.scale(s).mode(mode)
    rate < 0 && (rate = 0)
    rate > 1 && (rate = 1)
    return scale(rate)
}

export const colorContract = function (color) {
    let c = chroma(color)
    return c.alpha(0.3).hex()
}

export const color = function (color) {
    return chroma.valid(color) ? chroma(color).hex() : '#ffffff'
}