import * as L from "leaflet";
import { useCallback } from "react";

const usePerimeter = () => {
  const perimiterCalculator = useCallback((point, radius, applyData) => {
    const bounds = L.latLng(point).toBounds(radius);
    const northWest = bounds.getNorthWest();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const southEast = bounds.getSouthEast();

    const perimeterRadius = [
      [point[0], point[1]],
      [northEast.lat, northEast.lng],
      [northWest.lat, northEast.lng],
      [southWest.lat, northEast.lng],
      [southEast.lat, northEast.lng],
      [point[0], point[1]],
    ];

    applyData(perimeterRadius);

    return perimiterCalculator;
  }, []);

  return perimiterCalculator;
};

export default usePerimeter;
