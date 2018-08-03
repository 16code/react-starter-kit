import { Button, Tooltip, Popover, Checkbox } from 'antd';
import { toggleFullScreen } from 'utils';
import styles from './index.less';

export default class ToolbarRight extends React.PureComponent {
    state = {
        visible: false,
        isFullscreen: false,
        key: this.randomKey
    };
    handleCheckboxChange = (item, event) => {
        item.checked = event.target.checked;
    };
    handleVisibleChange = visible => {
        this.setState({ visible });
    };
    handleConfirm = () => {
        this.setState({ visible: false });
        this.props.onConfirm(this.props.columns);
    };
    handleReset = () => {
        const columns = this.resetCheckd;
        this.props.onConfirm(columns);
        this.setState({ visible: false, key: this.randomKey });
    };
    get randomKey() {
        return Math.random()
            .toString(32)
            .substr(2, 7);
    }
    get resetCheckd() {
        return this.props.columns.map(c => {
            c.checked = true;
            return c;
        });
    }
    renderCheckBox = () => {
        const { columns } = this.props;
        const { key } = this.state;
        return (
            <div className={styles['selection-wrapper']}>
                <div className={styles['selection-list']} key={key}>
                    {columns.map(
                        (c, index) =>
                            c.dataIndex && (
                                <div className={styles['selection-item']} key={index}>
                                    <Checkbox
                                        onChange={event => this.handleCheckboxChange(c, event)}
                                        value={c.dataIndex}
                                        defaultChecked={c.checked || true}
                                    >
                                        {c.title}
                                    </Checkbox>
                                </div>
                            )
                    )}
                </div>
                <div className={styles['selection-actions']}>
                    <Button
                        onClick={this.handleConfirm}
                        htmlType="button"
                        type="primary"
                        style={{ marginRight: '8px' }}
                    >
                        确定
                    </Button>
                    <Button onClick={this.handleReset} htmlType="button">
                        重置
                    </Button>
                </div>
            </div>
        );
    };
    handleToggleFullScreen = () => {
        const dom = document.querySelector('.page-content');
        toggleFullScreen(dom);
        this.setState(prevState => ({ isFullscreen: !prevState.isFullscreen }));
    };
    render() {
        return [
            <Tooltip placement="top" key="reload" title="重载数据">
                <Button
                    disabled={this.props.loading}	
                    shape="circle"
                    icon="reload"
                    onClick={() => (this.props.onReload && this.props.onReload()) || undefined}
                />
            </Tooltip>,
            <Tooltip placement="top" key="fullScreen" title="全屏切换">
                <Button
                    key="fullScreen"
                    shape="circle"
                    icon={this.state.isFullscreen ? 'shrink' : 'arrows-alt'}
                    onClick={this.handleToggleFullScreen}
                />
            </Tooltip>,	
            <Popover
                key="columnFiled"
                placement="leftTop"
                content={this.renderCheckBox()}
                visible={this.state.visible}
                title="选择显示字段"
                trigger="click"
                onVisibleChange={this.handleVisibleChange}
            >
                <Tooltip placement="top" title="表头设置">
                    <Button
                        type="default"
                        shape="circle"
                        icon="setting"
                        onClick={() => this.handleVisibleChange(false)}
                    />
                </Tooltip>
            </Popover>
        ];
    }
}

