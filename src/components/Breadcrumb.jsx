import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { urlToList } from 'utils/index';
import { getMenuData, getMenuDataPathKeys } from 'common/menuData';

const BreadcrumbItem = Breadcrumb.Item;
const menuData = getMenuData();
const menuDataPathKeys = getMenuDataPathKeys(menuData);

@withRouter
export default class CustomBreadcrumb extends React.PureComponent {
    static propTypes = {
        routesMap: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    };
    static defaultProps = {
        routesMap: menuDataPathKeys
    };
    renderItem = (url, routeName) => {
        return (
            <BreadcrumbItem key={url}>
                <Link to={url}>{routeName}</Link>
            </BreadcrumbItem>
        );
    };
    renderLast = (url, routeName) => <BreadcrumbItem key={url}>{routeName}</BreadcrumbItem>;
    conversionBreadcrumbList = () => {
        const { location, routesMap } = this.props;
        const pathSnippets = urlToList(location.pathname);
        const extraBreadcrumbItems = pathSnippets.map((url, index) => {
            const routeName = routesMap[url] && routesMap[url].name;
            const isLast = index === pathSnippets.length - 1;
            const isFirst = index === 0;
            if (routeName) {
                return isFirst || isLast ? this.renderLast(url, routeName) : this.renderItem(url, routeName);
            }
            return null;
        });
        const breadcrumbItems = [
            <BreadcrumbItem key="home">
                <Link to="/">首页</Link>
            </BreadcrumbItem>
        ].concat(extraBreadcrumbItems);
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
    };
    render() {
        const breadcrumb = this.conversionBreadcrumbList();
        return breadcrumb;
    }
}
