import Exception from 'components/Exception';
import { Link } from 'react-router-dom';

export default function page403() {
    return <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />;
}
