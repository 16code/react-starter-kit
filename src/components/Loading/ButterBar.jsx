import classNames from 'classnames';
import styles from './ButterBar.less';
const { butterBar, bar, active } = styles;
export default function ButterBar({ visible }) {
    return (
        <div className={classNames(butterBar, { [active]: visible })}>
            <span className={bar} />
        </div>
    );	
}