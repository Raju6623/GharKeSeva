import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { 
  AirVent, 
  Pipette as Pipe, 
  Paintbrush, 
  Zap, 
  UserCheck, 
  Waves, 
  Thermometer, 
  Hammer, 
  Trash2,
  Lock
} from 'lucide-react';

const ServiceCategorySection = ({ onCategorySelection }) => {

  // 1. Comprehensive Service Data Object (Added "slug" for professional URLs)
  const serviceCategories = [
    { 
      id: 1, 
      categoryName: "AC Service", 
      slug: "acservice", // Used for the link path
      serviceIcon: <AirVent size={32} />, 
      backgroundStyles: "bg-blue-50 text-blue-600",
      description: "Repair & Install" 
    },
    { 
      id: 2, 
      categoryName: "Plumbing", 
      slug: "plumbing-service",
      serviceIcon: <Pipe size={32} />, 
      backgroundStyles: "bg-orange-50 text-orange-600",
      description: "Leaks & Pipes" 
    },
    { 
      id: 3, 
      categoryName: "Painting", 
      slug: "painting-service",
      serviceIcon: <Paintbrush size={32} />, 
      backgroundStyles: "bg-purple-50 text-purple-600",
      description: "Home & Office" 
    },
    { 
      id: 4, 
      categoryName: "Electrician", 
      slug: "electrician-service",
      serviceIcon: <Zap size={32} />, 
      backgroundStyles: "bg-yellow-50 text-yellow-600",
      description: "Wiring & Fixes" 
    },
    { 
      id: 5, 
      categoryName: "House Maid", 
      slug: "house-maid-service",
      serviceIcon: <UserCheck size={32} />, 
      backgroundStyles: "bg-pink-50 text-pink-600",
      description: "Daily Cleaning" 
    },
    { 
      id: 6, 
      categoryName: "RO Service", 
      slug: "ro-service",
      serviceIcon: <Waves size={32} />, 
      backgroundStyles: "bg-cyan-50 text-cyan-600",
      description: "Water Purifier" 
    },
    { 
      id: 7, 
      categoryName: "Carpenter", 
      slug: "carpenter-service",
      serviceIcon: <Hammer size={32} />, 
      backgroundStyles: "bg-amber-50 text-amber-700",
      description: "Furniture Work" 
    },
    { 
      id: 8, 
      categoryName: "Appliances", 
      slug: "appliances-service",
      serviceIcon: <Thermometer size={32} />, 
      backgroundStyles: "bg-red-50 text-red-600",
      description: "Fridge & Oven" 
    },
    { 
      id: 9, 
      categoryName: "Pest Control", 
      slug: "pestcontrol-service",
      serviceIcon: <Trash2 size={32} />, 
      backgroundStyles: "bg-emerald-50 text-emerald-600",
      description: "Deep Protection" 
    },
    { 
      id: 10, 
      categoryName: "Smart Lock", 
      slug: "smartlock-service",
      serviceIcon: <Lock size={32} />, 
      backgroundStyles: "bg-indigo-50 text-indigo-600",
      description: "Safety & Security" 
    }
  ];

  const handleSelection = (selectedCategoryName) => {
    console.log("Category selected:", selectedCategoryName);
    if (onCategorySelection) {
      onCategorySelection(selectedCategoryName);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            What are you <span className="text-blue-600">looking for?</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Explore our wide range of professional home services.</p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {serviceCategories.map((category) => (
            // WRAPPED IN LINK: Navigates to the service page
            <Link 
              to={`/services/${category.slug}`} 
              key={category.id}
              onClick={() => handleSelection(category.categoryName)}
              className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 block"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className={`p-4 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${category.backgroundStyles}`}>
                  {category.serviceIcon}
                </div>
                
                {/* Text Content */}
                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1 leading-tight">
                  {category.categoryName}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategorySection;