import PropTypes from 'prop-types';
import classNames from 'classnames';
import Breadcrumb from 'components/Breadcrumb';
import styles from './style.less';
export default class PageHeader extends React.PureComponent {
    static propTypes = {
        action: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
    };
    render() {
        const { action, className } = this.props;
        const clsString = classNames(styles['layout-header'], className);
        return (
            <div className={clsString}>
                <Breadcrumb />
                {action && <div className={styles.actions}>{action}</div>}
            </div>
        );
    }
}
