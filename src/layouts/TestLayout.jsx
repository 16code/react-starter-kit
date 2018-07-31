import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';

export default class Test extends React.Component {
    state = {
        id: Math.random()
    };
    componentWillUnmount() {
        setTimeout(() => {
            this.setState({ id: Math.random() });
        }, 2000);
        console.log('unmount');
    }
    render() {
        return (
            <div>
                <Button>test2</Button>
                <Icon type="step-forward" />
                Test <Link to="/">Home</Link>
                This is a test component., id: {this.state.id}
            </div>
        );
    }
}
