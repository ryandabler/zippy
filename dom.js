const SELECTOR_PIECES = /(?:#|\.)?(?:\w(-\w)*)+|(\[.+?\])/g;

const createElement = selector => {
    const [tagName, ...attributes] = selector.match(SELECTOR_PIECES);
    const element = document.createElement(tagName);

    attributes.forEach(attribute => {
        if (attribute.startsWith('.')) {
            element.classList.add(attribute.slice(1));
        }

        if (attribute.startsWith('#')) {
            element.setAttribute('id', attribute.slice(1));
        }

        if (attribute.startsWith('[') && attribute.endsWith(']')) {
            attribute = attribute.slice(1, -1);
            const [left, right] = attribute.split('=');
            element.setAttribute(left, right.slice(1, -1));
        }
    });

    return element;
};

const createElementTree = (selector, childrenArray) => {
    const element = createElement(selector);

    childrenArray.forEach(child => {
        element.append(createElementTree(...child));
    });

    return element;
};

class DOM {
    constructor(node) {
        this._node = node;
    }

    addClass(_class) {
        this._node.classList.add(_class);
        return this;
    }

    removeClass(_class) {
        this._node.classList.remove(_class);
        return this;
    }

    addEventListener(type, cb, config) {
        this._node.addEventListener(type, cb, config);
        return this;
    }

    node() {
        return this._node;
    }
}
