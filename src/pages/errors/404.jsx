import Exception from 'components/Exception';
import { Link } from 'react-router-dom';

export default function page404() {
    return <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
}
