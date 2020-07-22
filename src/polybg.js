/**
 * @author Debonex
 * @fileoverview Entry for PolyBG 
 * @date 2020年7月22日16:12:05
 */

import Poly from './Poly'
import './css/poly.css'

const defaultOption = {
    width: 400,
    height: 400,
    color: {
        type: 'liner'
    },
    layout: {
        type: 'triangle'
    },
    hover:{
        color: 'trans'
    }
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
    //#endregion

    return new Poly(option)
}