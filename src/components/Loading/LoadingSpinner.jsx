import classNames from 'classnames';

import styles from './LoadingSpinner.less';
const iconStyle = {
    large: [styles.large],
    small: [styles.small]
};
export default function LoadingSpinner({ size, ...rest }) {
    const classStr = classNames(styles.loader, iconStyle[size]);
    return (
        <div className={classStr} {...rest}>
            <svg className={styles.circular} viewBox="25 25 50 50">
                <circle
                    className={styles.path}
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                />
            </svg>
        </div>
    );
}
