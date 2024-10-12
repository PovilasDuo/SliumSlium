import AllBooks from "../components/AllBooks";

export default function HomePage() {
  const html = (
    <>
      <div className="container">
        <AllBooks />
        <div></div>
      </div>
    </>
  );
  return html;
}
