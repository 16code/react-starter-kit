export default function BlankLayout({ children, gutter = '16' }) {
    return (
        <div id="page-content" className="app-page-content" style={{ padding: `0.${gutter}rem` }}>
            {children}
        </div>
    );
}
