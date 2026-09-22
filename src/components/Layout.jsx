import Header from "./Header";

export default function Layout({ children, title, dashboard = false }) {
  return (
    <>
      <div className="bg-gradient" />
      <div className="grid-bg" />
      <Header title={title} dashboard={dashboard} />
      {children}
    </>
  );
}