import Header from "./header";

const Layout = ({ children }) => (
  <>
    <Header />
    <main>
      <div className="container">{children}</div>
    </main>
    <style>{`
      * {
        font-family: sans-serif !important;
        outline: none;
      }
      .container {
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 10px;
      }
    `}</style>
  </>
);

export default Layout;
