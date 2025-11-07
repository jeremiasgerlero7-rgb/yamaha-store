import { ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const ProductCard = ({ product }) => {
  const getOptimizedImageUrl = (url) => {
    if (!url) {
      return 'https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg';
    }
    
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/${parts[1]}`;
      }
    }
    return url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Contenedor de imagen con badge de stock */}
      <div className="relative w-full h-64 bg-gray-200 flex-shrink-0">
        <OptimizedImage
          src={getOptimizedImageUrl(product.imagen)}
          alt={product.nombre}
          className="w-full h-64"
          placeholder="https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg"
          onError={(e) => {
            e.target.src = 'https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg';
          }}
        />
        
        {/* Badge de disponibilidad */}
        <div className="absolute top-3 right-3">
          {product.disponible && product.cantidad > 0 ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Package className="w-3 h-3" />
              <span>Stock: {product.cantidad}</span>
            </div>
          ) : (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Sin Stock
            </div>
          )}
        </div>

        {/* Badge de categoría SIN icono */}
        <div className="absolute top-3 left-3">
          <div className="bg-yamaha-blue text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg capitalize">
            {product.categoria}
          </div>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.nombre}
        </h3>

        <p className="text-black-600 font-bold text-sm mb-4">
          {product.cilindrada} (cc) {product.velocidadMax} KM/h {product.peso} Kg
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.descripcion}
        </p>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-yamaha-blue">
            ${product.precio.toLocaleString()}
          </span>
          <Link
            to={`/cotizar/${product._id}`}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              product.disponible && product.cantidad > 0
                ? 'bg-yamaha-blue text-white hover:bg-yamaha-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>{product.disponible && product.cantidad > 0 ? 'Cotizar' : 'No disponible'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;