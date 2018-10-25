import { Button, Radio, Tag } from 'antd';
import { PageHeaderLayout } from 'layouts/index';
import DynamicTable from 'components/DynamicTable';
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const headAction = (
    <>
        <ButtonGroup>
            <Button icon="download">导出</Button>
            <Button icon="to-top">导入</Button>
        </ButtonGroup>
        <Button type="primary" icon="plus">
            添加
        </Button>
    </>
);
export default class ProdList extends React.PureComponent {
    state = {
        params: {}
    };
    handleReset = () => {
        this.setState({ params: { state: '' } });
    };
    handleSearch = values => {
        values.state = this.state.params.state;
        this.setState({ params: { ...values } });
    };
    handleStateChange = e => {
        const params = { ...this.state.params };
        params.state = e.target.value;
        this.setState({ params });
    };
    render() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'image',
                key: 'image',
                render: (value, record) => {
                    return (
                        <div>
                            <img src={value} width="50" height="50" />
                            <a
                                href="javascript:;"
                                style={{ paddingLeft: '8px' }}
                                onClick={() => this.handleShowDock(record)}
                            >
                                {record.name}
                            </a>
                        </div>
                    );
                }
            },
            { title: '分类', dataIndex: 'category', key: 'category' },
            { title: '颜色', dataIndex: 'color', key: 'color' },
            { title: '单价', dataIndex: 'price', key: 'price' },
            { title: '销量', dataIndex: 'sales', key: 'sales' },
            { title: '库存', dataIndex: 'stock', key: 'stock' },
            {
                title: '来源',
                dataIndex: 'origin',
                key: 'origin',
                render: value => {
                    const gender =
                        value === 'self' ? { name: '自有产品', color: 'blue' } : { name: '外部采购', color: 'gold' };
                    return <Tag color={gender.color}>{gender.name}</Tag>;
                }
            },
            { title: '所属公司', dataIndex: 'company', key: 'company' },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: value => {
                    const gender =
                        value === 'online' ? { name: '已上线', color: 'green' } : { name: '已下线', color: 'magenta' };
                    return <Tag color={gender.color}>{gender.name}</Tag>;
                }
            },
            { title: '上架时间', dataIndex: 'createAt', key: 'createAt' }
        ];
        const extra = [
            <RadioGroup key="state" onChange={this.handleStateChange} value={this.state.params.state}>
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="online">已上线</RadioButton>
                <RadioButton value="offline">已下线</RadioButton>
            </RadioGroup>
        ];

        return (
            <PageHeaderLayout title="用户列表" action={headAction}>
                <DynamicTable
                    rowKey="id"
                    url="/products"
                    searchParams={this.state.params}
                    fieldKey="data"
                    columns={columns}
                    scroll={{ x: 1280 }}
                    extra={extra}
                    showSizeChanger
                />
            </PageHeaderLayout>
        );
    }
}
