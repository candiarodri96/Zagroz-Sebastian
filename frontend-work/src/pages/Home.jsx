import Header from "../components/Header.jsx";
import Searchbar from "../components/Searchbar.jsx";
import SelectOption from "../components/SelectOption.jsx";



function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-6">

      <div className="flex items-start mt-70 justify-between">

        <Header />
        <SelectOption />

        {/*<div className=" ml-120 w-100">
          <Searchbar />
        </div>*/}
        

      </div>
      <h2 className="ml-2 text-gray-400">
        Matching help to your solutions
      </h2>

    </div>
  );
}

export default Home;
