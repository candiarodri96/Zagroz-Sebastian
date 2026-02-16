import React from "react";
import { MapPin, User } from "lucide-react";

const ServiceCard = ({ image, title, location, author, description }) => {
  return (
    <div className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Work name */}
        <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
        )}

        {/* Details of the job */}
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          {/* Location of work */}
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span>{location}</span>
          </div>

          {/* Published By */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={12} />
            </div>
            <span className="text-xs">
              By: <span className="font-medium not-italic">{author}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
