/* eslint-disable max-len */
import PropTypes from 'prop-types';
const imgColor = '#f4b400';
const mediaColor = '#7a3ce7';
const zipColor = '#acacac';
const xlsColor = '#0f9d58';
const colorMapper = {
    pdf: '#e13d34',
    doc: '#307cf1',
    ppt: '#d24726',
    txt: '#5eb533',
    xls: xlsColor,
    xlsx: xlsColor,
    zip: zipColor,
    rar: zipColor,
    bmp: imgColor,
    jpg: imgColor,
    jpeg: imgColor,
    gif: imgColor,
    png: imgColor,
    mp4: mediaColor,
    mp3: mediaColor,
    flac: mediaColor,
    defaultColor: '#6180ff'
};

export default class FileIcon extends React.PureComponent {
    static propTypes = {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        color: PropTypes.string
    };
    static defaultProps = {
        width: 48,
        height: 64
    };
    get fillColor() {
        const { type, color } = this.props;
        return color || colorMapper[type] || colorMapper.defaultColor;
    }
    get fontSize() {
        const { type } = this.props;
        if (type.length > 7) {
            return 22;
        } else if (type.length > 4) {
            return 32;
        }
        return 36;
    }
    render() {
        const { width, height, type } = this.props;
        const fillColor = this.fillColor;
        return (
            <svg width={width} height={height} viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                    <path
                        d="M6.41 0h50.725c1.294 0 1.742.047 2.238.162s.935.297 1.366.568c.431.27.78.555 1.693 1.472l12.846 12.906.41.413.14.14.41.415 21.595 21.82c.904.913 1.184 1.261 1.45 1.69.267.43.446.866.558 1.358.113.493.159.937.159 2.222v70.424c0 2.23-.232 3.037-.668 3.852a4.543 4.543 0 0 1-1.89 1.89c-.815.436-1.623.668-3.852.668H6.41c-2.23 0-3.037-.232-3.852-.668a4.543 4.543 0 0 1-1.89-1.89C.232 116.627 0 115.82 0 113.59V6.41c0-2.23.232-3.037.668-3.852a4.543 4.543 0 0 1 1.89-1.89C3.373.232 4.18 0 6.41 0z"
                        fill={fillColor}
                    />
                    <path d="M100 40H74.707C66.975 40 60 33.025 60 25.293V0l40 40z" fill="rgba(255, 255, 255, 0.35)" />
                    <text
                        fontSize={this.fontSize}
                        alignmentBaseline="middle"
                        textAnchor="middle"
                        fill="#FFF"
                        x="50%"
                        y="70%"
                    >
                        {type}
                    </text>
                </g>
            </svg>
        );
    }
}
