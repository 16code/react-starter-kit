export default class Dragger extends React.PureComponent {
    uploaderRef = React.createRef();
    inputId = `input-${Math.random()
        .toString(36)
        .substr(7, 12)}`;
    componentDidMount() {
        this.uploader = this.uploaderRef.current;
        this.bindEvents();
    }
    bindEvents() {
        const events = {
            drop: this.onFileDrop,
            dragover: this.onFileDragover,
            dragleave: this.onFileDragleave,
            paste: this.onFilePaste
        };
        this.uploader = this.uploaderRef.current;
        for (const event in events) {
            this.uploader.addEventListener(event, events[event]);
        }
    }
    triggerEvent = files => this.props.onDrop && this.props.onDrop(files);
    onFileDrop = event => {
        event.preventDefault();
        this.uploader.classList.remove('drag-enter');
        this.triggerEvent(event.dataTransfer.items);
    };
    onFileDragleave = event => {
        event.preventDefault();
        this.uploader.classList.remove('drag-enter');
    };
    onFileDragover = event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const classList = this.uploader.classList;
        const styleName = 'drag-enter';
        if (!classList.contains(styleName)) {
            this.uploader.classList.add(styleName);
        }
    };
    handleCopydItems = items => {
        return Array.prototype.slice
            .call(items)
            .filter(file => {
                const { kind, type } = file;
                return kind === 'file' && type.indexOf('image/') !== -1;
            })
            .map(_f => {
                const f = _f.getAsFile();
                f.isPaste = true;
                return f;
            });
    };
    onFilePaste = event => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const files = this.handleCopydItems(clipboardData.items);
        this.triggerEvent(files);
    };
    handleChooseFile = event => {
        this.triggerEvent(event.target.files);
    };
    handleInputClick = () => {
        if (!this.props.disabled) {
            document.getElementById(this.inputId).click();
        }
    };
    render() {
        const { styles, multiple, accept, directory, disabled } = this.props;
        return (
            <div className={styles['drag-box']} ref={this.uploaderRef}>
                <i className={styles['upload-icon']} />
                <h3 className={styles['scroll-tips']}>
                    <span>Drag and drop files here</span>
                    <span className={styles['accept-tips']}>松开鼠标即可释放文件, 允许上传的文件类型: {accept}</span>
                </h3>
                <small className={styles.help}>or</small>
                <button
                    className={styles['browse-btn']}
                    role="button"
                    onClick={this.handleInputClick}
                    disabled={disabled}
                >
                    Browse files
                </button>
                <input
                    type="file"
                    id={this.inputId}
                    accept={accept}
                    directory={directory ? 'directory' : null}
                    webkitdirectory={directory ? 'webkitdirectory' : null}
                    multiple={multiple}
                    onChange={this.handleChooseFile}
                />
            </div>
        );
    }
}
