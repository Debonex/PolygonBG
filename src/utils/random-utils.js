/**
 * @author Debonex
 * @fileoverview Random methods 
 * @date 2020年7月22日16:12:23
 */


export const plainRndom = function(base, rate, len) {
    return base + (Math.random() * rate - 0.5) * len
}