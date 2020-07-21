export const plainRndom = function(base, rate, len) {
    return base + (Math.random() * rate - 0.5) * len
}