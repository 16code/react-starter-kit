import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userActions } from 'reducers/auth';

const FormItem = Form.Item;
@Form.create()
@withRouter
@connect(
    ({ auth }) => ({ isloading: auth.isloading }),
    { userLogin: userActions.userLogin }
)
export default class NormalLoginForm extends React.PureComponent {
    handleLoginSuccess(user) {
        this.props.userLogin(user);
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { username, password } = values;
                if (username && password) {
                    this.handleLoginSuccess(values);
                }
            }
        });
    };
    getBtnText(state) {
        return state ? '登录中...' : '登 陆';
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isloading } = this.props;
        return (
            <f>
                <h1 className="login-form-title">{APP_NAME}</h1>
                <div className="login-form">
                    <Form onSubmit={this.handleSubmit} autoComplete="off">
                        <FormItem key="username">
                            {getFieldDecorator('username', {
                                initialValue: 'liuxin',
                                rules: [{ required: true, message: '请输入您的用户名!' }]
                            })(
                                <Input
                                    size="large"
                                    prefix={<Icon type="user" className="input-icon" />}
                                    placeholder="用户名或手机号"
                                />
                            )}
                        </FormItem>
                        <FormItem key="password">
                            {getFieldDecorator('password', {
                                initialValue: 'Aa123456',
                                rules: [{ required: true, message: '请输入您的用户密码!' }]
                            })(
                                <Input
                                    size="large"
                                    prefix={<Icon type="lock" className="input-icon" />}
                                    type="password"
                                    autoComplete="off"
                                    placeholder="登陆密码"
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
                                {this.getBtnText(isloading)}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </f>
        );
    }
}
