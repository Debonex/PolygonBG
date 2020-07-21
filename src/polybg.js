/**
 * @author Debonex
 * @fileoverview Entry for PolyBG 
 */

import Poly from './Poly'

const defaultOption = {
    id: undefined,
    width: 400,
    height: 400,
    color: {
        type: 'liner'
    },
    layout: {
        type: 'triangle'
    },
    seed: undefined
}

const optionKeys = Object.keys(defaultOption)

export default function polybg(opts = {}) {

    //#region params check. make sure the option entered is legal.
    Object.keys(opts).forEach(e => {
        if (!optionKeys.includes(e) || !opts[e]) {
            throw TypeError('Unknown option "' + e + '"')
        }
    })
    let option = { ...defaultOption, ...opts }

    if (!(option.width > 0) || !(option.height > 0)) {
        throw TypeError('Invalid width or height.')
    }
    option.seed = option.seed || Math.random()
    //#endregion

    return new Poly(option)
}