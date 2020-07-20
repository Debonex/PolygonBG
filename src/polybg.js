/**
 * @author Debonex
 * @fileoverview Entry for PolyBG 
 */

import Poly from './Poly'

const defaultOption = {
    id: undefined,
    width: 800,
    height: 800
}

const optionKeys = Object.keys(defaultOption)

export default function polybg(opts = {}) {

    Object.keys(opts).forEach(e => {
        if (!optionKeys.includes(e) || !opts[e]) {
            throw TypeError('Unknown option "' + e + '"')
        }
    })
    let option = {...defaultOption, ...opts }

    return new Poly()
}