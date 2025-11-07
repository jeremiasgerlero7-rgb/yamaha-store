import { FaMotorcycle, FaTruckPickup, FaCarSide } from 'react-icons/fa';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all',  name: 'Todos',    icon: null  },
    { id: 'moto', name: 'Motos',    icon: FaMotorcycle  },
    { id: 'utv',  name: 'UTV',      icon: FaTruckPickup  },
    { id: 'atv',  name: 'ATV',      icon: FaCarSide }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-yamaha-blue text-white shadow-lg'
                    : 'bg-yamaha-dark-800 text-gray-300 hover:bg-yamaha-dark-700 border border-yamaha-blue-900/30'
                }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;