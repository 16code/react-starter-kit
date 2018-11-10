import FileIcon from './FileIcon';
import { formatBytes } from './utils';
export default ({ styles, items }) => (
    <ul className={styles['files-list']}>
        {items.map(file => (
            <li key={file.uid}>
                {file.previewUri ? (
                    <span className={styles.thumb}>
                        <img src={file.previewUri} />
                    </span>
                ) : (
                    <FileIcon type={file.ext} />
                )}
                <span className={styles.info}>
                    <span className={styles.name}>{file.pastedFileName || file.name}</span>
                    <span className={styles.size}>{formatBytes(file.size, true)}</span>
                </span>
                <span>操作</span>
            </li>
        ))}
    </ul>
);
