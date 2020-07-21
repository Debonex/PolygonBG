import chroma from 'chroma-js'

export const xyMix = function (start, end, x, y, mode) {
    let scale = chroma.scale([start, end]).mode(mode)
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
