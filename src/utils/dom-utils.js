
export const makeNode = function (tag, attrs, children, id = undefined) {
    let root = document.createElementNS('http://www.w3.org/2000/svg',tag)
    for(let attr in attrs){
        attrs[attr] && (root.setAttribute(attr,attrs[attr]))
    }
    id && root.setAttribute('id',id)
    children && children.forEach(child => {
        root.appendChild(child)
    })
    return root
}