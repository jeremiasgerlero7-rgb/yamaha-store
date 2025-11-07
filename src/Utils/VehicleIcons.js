import { GiDirtBike, GiQuadBike, GiJeep } from 'react-icons/gi';

export const getVehicleIcon = (categoria) => {
  const icons = {
    moto: GiDirtBike,
    atv: GiQuadBike,
    utv: GiJeep
  };
  
  return icons[categoria] || GiDirtBike;
};
