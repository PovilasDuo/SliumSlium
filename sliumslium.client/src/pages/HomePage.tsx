import AllBooks from "../components/AllBooks";
import Search from "../components/Search";

export default function HomePage() {
  const html = (
    <>
      <Search></Search>
      <div className="container">
        <AllBooks />
        <div></div>
      </div>
    </>
  );
  return html;
}
