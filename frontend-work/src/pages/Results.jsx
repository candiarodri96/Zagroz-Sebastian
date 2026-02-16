import React from "react";
import SearchBar from "../components/Searchbar";
import ServiceCard from "../components/Card";

export default function Results() {

  const items = [
    { id: 1, title: "Renovera Lägenhetshus", author: "PEAB", location: "Stockholm", image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "This is work 1 description" },
    { id: 2, title: "Bygga hus", author: "Byggarna", location: "Gothenburg", image: "https://images.unsplash.com/photo-1694521787673-28cbd8830ea5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "This is work 2 description" },
    { id: 3, title: "Fixa tak", author: "Snickrarna", location: "Malmö", image: "https://images.unsplash.com/photo-1635424709845-3a85ad5e1f5e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "This is work 3 description" },
  ]


  return (
    <div className="max-w-6xl mx-auto px-6 mt-25">
      <div className="flex gap-4 mb-12 justify-center">
    <SearchBar></SearchBar>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <ServiceCard
            key={item.id}
            image={item.image}
            title={item.title}
            location={item.location}
            author={item.author}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

