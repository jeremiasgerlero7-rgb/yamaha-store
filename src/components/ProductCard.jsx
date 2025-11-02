import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Función para transformar URL de Cloudinary y forzar tamaño uniforme
  const getOptimizedImageUrl = (url) => {
    if (!url) {
      return 'https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg';
    }
    
    // Si es una URL de Cloudinary, agregar/reemplazar transformaciones
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
      {/* Contenedor de imagen con altura fija */}
      <div className="relative w-full h-64 bg-gray-200 flex-shrink-0">
        <img 
          src={getOptimizedImageUrl(product.imagen)}
          alt={product.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://res.cloudinary.com/dbqapcw0r/image/upload/w_800,h_600,c_fill,g_center,q_auto,f_auto/moto.jpg';
          }}
        />
      </div>
      
      {/* Contenido con flex-grow para ocupar el espacio restante */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.nombre}
        </h3>
        <p className="text-black-600 font-bold text-sm mb-4">
          {product.cilindrada} (cc) {product.velocidadMax} KM/h {product.peso} Kg
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.descripcion}
        </p>
        
        {/* Footer fijo al final */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-yamaha-blue">
            ${product.precio.toLocaleString()}
          </span>
          <Link
            to={`/cotizar/${product._id}`}
            className="flex items-center space-x-2 bg-yamaha-blue text-white px-4 py-2 rounded-lg hover:bg-yamaha-dark transition"
          >
            <span>Cotizar</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;