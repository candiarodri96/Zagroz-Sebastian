import { useNavigate } from "react-router-dom";

function SelectOption() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">

      <div className="w-[620px]">
        <button
          onClick={() => navigate("/results")}
          className="
            w-full
            h-32
            rounded-xl
            border-2 border-white/80
            bg-transparent
            text-white
            hover:bg-white hover:text-black
            transition
            flex flex-col justify-center
            px-8
          "
        >
          <span className="text-xl font-semibold">
            Find Task
          </span>
          <span className="mt-1 text-sm font-light opacity-80">
            Find your next task for you and your team to work on
          </span>
        </button>
      </div>

      <div className="w-[620px]">
        <button
          onClick={() => navigate("/create")}
          className="
            w-full
            h-32
            rounded-xl
            border-2 border-white/80
            bg-transparent
            text-white
            hover:bg-white hover:text-black
            transition
            flex flex-col justify-center
            px-8
          "
        >
          <span className="text-xl font-semibold">
            Upload Task
          </span>
          <span className="mt-1 text-sm font-light opacity-80">
            Upload your task and get matched with the best solution for you
          </span>
        </button>
      </div>

    </div>
  );
}

export default SelectOption;
