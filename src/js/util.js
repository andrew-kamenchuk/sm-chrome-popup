export const parseURL = (() => {
    const parser = document.createElement("a");

    return (url, ...parts) => {
        parser.setAttribute("href", url);

        switch (parts.length) {
            case 0:
                return Object.assign({}, parser);
            case 1:
                return parser[parts[0]];
            default:
                return parts.map(part => parser[part]);
        }
    };
})();

export const encodeHTML = (() => {
    const encoder = document.createElement("textarea");

    return text => {
        encoder.textContent = text;
        return encoder.innerHTML;
    };
})();

export const createLogger = name => console.log.bind(console, name + ":");
