import { Bike, Car, Truck as UtvIcon } from 'lucide-react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
 const categories = [
  { id: 'all',  name: 'Todos',    icon: null  },
  { id: 'moto', name: 'Motos',    icon: Bike  },
  { id: 'utv',  name: 'UTV',      icon: UtvIcon  },
  { id: 'atv',  name: 'ATV',      icon: Car }
];

  return (
    <div className="bg-white py-6 shadow-sm">
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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