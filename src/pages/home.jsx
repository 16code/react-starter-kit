import Uploader from 'components/uploader';

export default class HomePage extends React.PureComponent {
    handleOnChange = list => {
        console.log(list);
    };
    render() {
        return (
            <div style={{ padding: '30px' }}>
                <Uploader accept="image/*,.xlsx" multiple onChange={this.handleOnChange} />
            </div>
        );
    }
}
