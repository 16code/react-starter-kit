import PageHeader from './PageHeader';

export default function PageHeaderLayout({ children, action }) {
    return (
        <>
            <PageHeader key="pageheader" action={action} />
            <section id="app-page-content" className="app-page-content">
                {children}
            </section>
        </>
    );
}
