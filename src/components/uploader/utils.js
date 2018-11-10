function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function attrAccept(file, acceptedFiles) {
    if (file && acceptedFiles) {
        const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
        const fileName = file.name || '';
        const mimeType = file.type || '';
        const baseMimeType = mimeType.replace(/\/.*$/, '');
        return acceptedFilesArray.some(type => {
            const validType = type.trim();

            if (validType.charAt(0) === '.') {
                return endsWith(fileName.toLowerCase(), validType.toLowerCase());
            } else if (/\/\*$/.test(validType)) {
                // This is something like a image/* mime type
                return baseMimeType === validType.replace(/\/.*$/, '');
            }
            return mimeType === validType;
        });
    }
    return true;
}

export const traverseFileTreeLoop = (files, callback, isAccepted) => {
    const traverseFileTreeLoop = (item, path) => {
        path = path || '';
        if (item.isFile) {
            item.file(file => {
                if (isAccepted(file)) {
                    callback(file);
                }
            });
        } else if (item.isDirectory) {
            const dirReader = item.createReader();

            dirReader.readEntries(entries => {
                for (const entrieItem of entries) {
                    traverseFileTreeLoop(entrieItem, `${path}${item.name}/`);
                }
            });
        }
    };
    for (const file of files) {
        if (file.webkitGetAsEntry && file.webkitGetAsEntry()) {
            traverseFileTreeLoop(file.webkitGetAsEntry());
        } else {
            if (isAccepted(file)) {
                callback(file);
            }
        }
    }
};

export function formatBytes(a, b) {
    if (0 === a) return '0 Bytes';
    const c = 1024;
    const d = b || 2;
    const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const f = Math.floor(Math.log(a) / Math.log(c));
    return `${parseFloat((a / Math.pow(c, f)).toFixed(d))}${e[f]}`;
}

const now = +new Date();
let index = 0;
export function uid() {
    return `file-${now}-${++index}`;
}
