export const parseURL = (url, ...parts) => {
    url = new URL(url);

    switch (parts.length) {
        case 0:
            return url;
        case 1:
            return url[parts[0]];
        default:
            return parts.map(part => url[part]);
    }
};

export const encodeHTML = (() => {
    const encoder = document.createElement("textarea");

    return text => {
        encoder.textContent = text;
        return encoder.innerHTML;
    };
})();

export const createLogger = name => console.log.bind(console, name + ":");
