function SelectOption() {
  return (
    <div className="flex flex-col items-end gap-4 py-8">
      <button className="px-35 py-8 border border-white text-white rounded-lg bg-transparent hover:bg-white hover:text-black transition-all duration-200">
        Find Task
      </button>

      <button className="px-35 py-8 border border-white text-white rounded-lg bg-transparent hover:bg-white hover:text-black transition-all duration-200">
        Upload Task
      </button>
    </div>
  );
}

export default SelectOption;
