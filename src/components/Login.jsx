import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
@Form.create()
export default class NormalLoginForm extends React.PureComponent {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <f>
                <h1 className="login-form-title">{APP_NAME}</h1>
                <div className="login-form">
                    <Form onSubmit={this.handleSubmit} autoComplete="off">
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入登录用户名!' }]
                            })(
                                <Input
                                    prefix={<Icon type="user" />}
                                    placeholder="用户名"
                                    size="large"
                                    autoComplete="off"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入登录密码!' }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" />}
                                    type="password"
                                    placeholder="登陆密码"
                                    size="large"
                                    autoComplete="off"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(<Checkbox>记住账号</Checkbox>)}
                            <a className="login-form-forgot" href="#">
                                忘记密码
                            </a>
                            <Button type="primary" htmlType="submit" size="large" className="login-form-button">
                                登陆
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </f>
        );
    }
}
