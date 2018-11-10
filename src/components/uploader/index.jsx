import PropTypes from 'prop-types';
import Dragger from './Dragger';
import FileList from './FileList';
import { attrAccept, traverseFileTreeLoop, uid } from './utils';
import styles from './styles.less';
function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export default class Uploader extends React.PureComponent {
    static propTypes = {
        multiple: PropTypes.bool,
        directory: PropTypes.bool,
        disabled: PropTypes.bool,
        accept: PropTypes.string,
        onChange: PropTypes.func
    };
    static defaultProps = {
        accept: '',
        multiple: false
    };
    static getDerivedStateFromProps(nextProps) {
        if ('fileList' in nextProps) {
            return {
                fileList: nextProps.fileList || []
            };
        }
        return null;
    }
    constructor(props) {
        super(props);

        this.state = {
            fileList: props.fileList || props.defaultFileList || []
        };
    }
    componentDidMount() {}
    handleFileUpload = event => {
        const { files } = event.target;
        this.handleDataTransferItems(files);
    };
    uploadFiles = file => {
        const fileList = this.state.fileList;
        const { type, name: fileName } = file;
        const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
        const fileUid = uid();
        if (file.isPaste) file.pastedFileName = `pasted-${fileUid}.${fileExt}`;
        file.uid = fileUid;
        file.ext = fileExt;
        fileList.push(file);
        if (type.indexOf('image/') !== -1) {
            this.renderFile(file);
        } else {
            this.onChange(fileList);
        }
    };
    handleDataTransferItems = files => {
        traverseFileTreeLoop(files, this.uploadFiles, _f => attrAccept(_f, this.props.accept));
    };
    onChange = files => {
        const fileList = files || this.state.fileList;
        this.setState({ fileList: [...fileList] }, () => {
            const { onChange } = this.props;
            onChange && onChange(fileList);
        });
    };
    renderFile = file => {
        const reader = new FileReader();
        reader.onload = e => {
            const blob = dataURLtoBlob(e.target.result);
            file.previewUri = window.URL.createObjectURL(blob);
            window.URL.revokeObjectURL(blob);
            this.onChange();
        };
        reader.readAsDataURL(file);
    };
    render() {
        const { multiple, accept, directory, disabled } = this.props;
        const draggerProps = { multiple, accept, directory };
        const events = disabled
            ? {}
            : {
                onDrop: this.handleDataTransferItems
            };
        return (
            <div className={styles.uploader}>
                <Dragger
                    styles={styles}
                    disabled={disabled}
                    className={styles['drag-box']}
                    {...events}
                    {...draggerProps}
                />
                <FileList items={this.state.fileList} styles={styles} />
            </div>
        );
    }
}
