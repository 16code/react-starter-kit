import { Row, Col } from 'antd';
import Login from 'components/Login';
export default () => {
    return (
        <div className="layout-login">
            <Row type="flex" justify="center" align="middle">
                <Col xs={22} sm={14} md={10} lg={10} xl={6}>
                    <Login />
                </Col>
            </Row>
        </div>
    );
};
