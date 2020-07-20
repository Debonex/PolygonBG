/**
 * @author Debonex
 * @fileoverview core data structure for PolyBG, generate svg
 */

export default class Poly {

    constructor() {

    }

    generateSVG() {
        let root = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        return root
    }
}