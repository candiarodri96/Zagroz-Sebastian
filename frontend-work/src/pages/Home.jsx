import Header from "../components/Header.jsx";
import Searchbar from "../components/Searchbar.jsx";

function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-6">

      <div className="flex items-center justify-between">

        <Header />

        <div className=" ml-120 w-100">
          <Searchbar />
        </div>

      </div>

      <h2 className="mt-6 text-gray-400">
        Matching help to your solutions
      </h2>

    </div>
  );
}

export default Home;
