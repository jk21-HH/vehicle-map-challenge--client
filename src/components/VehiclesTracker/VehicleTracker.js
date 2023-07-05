import React, { useCallback, useEffect, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";

import Car from "../Car/Car";

import classes from "./VehicleTracker.module.css";

import useHttp from "../../hooks/use-http";

const VehicleTracker = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [perimeter, setPerimeter] = useState([
    [-0.0493916683, 51.4694976807],
    [-0.004475904446425087, 51.514413461242604],
    [-0.004475904446425087, 51.514413461242604],
    [-0.0943074321535749, 51.514413461242604],
    [-0.0943074321535749, 51.514413461242604],
    [-0.0493916683, 51.4694976807],
  ]);

  const [startingPoint, setStartingPoint] = useState([
    -0.0493916683, 51.4694976807,
  ]);

  const { setState } = useHttp();

  useEffect(() => {
    setState(
      {
        url: "/vehicles/getAllVehiclesLocation",
      },
      setVehicles
    );
  }, [setState]);

  const calculatePerimitar = useCallback((point, radius) => {
    const bounds = L.latLng(point).toBounds(radius);
    const northWest = bounds.getNorthWest();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const southEast = bounds.getSouthEast();

    return [
      [point[0], point[1]],
      [northEast.lat, northEast.lng],
      [northWest.lat, northEast.lng],
      [southWest.lat, northEast.lng],
      [southEast.lat, northEast.lng],
      [point[0], point[1]],
    ];
  }, []);

  const handleMapClick = useCallback(
    (e) => {
      const { lat, lng } = e.latlng;
      const pointClicked = [lng, lat];
      const radiusClicked = L.latLng(startingPoint).distanceTo(pointClicked);
      setStartingPoint(pointClicked);
      setPerimeter(calculatePerimitar(pointClicked, radiusClicked));
    },
    [calculatePerimitar, startingPoint]
  );

  useEffect(() => {
    // set the map view

    const map = L.map("map").setView([startingPoint[1], startingPoint[0]], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // set the blue marker on the map by coordinates

    vehicles.forEach((vehicle) => {
      L.marker([vehicle.lat, vehicle.lng]).addTo(map);
    });

    // set the zoom on the map

    map.on("click", handleMapClick);

    // distroys the map and clears the event

    return () => {
      map.remove();
    };
  }, [vehicles, startingPoint, handleMapClick]);

  const fetchVehiclesByPerimeter = useCallback(() => {
    // validations on perimter: for close perimeter we need at least for coordinates

    if (perimeter.length < 4) return;

    // validations on perimter: for close perimeter we need that the first and the last coordinate will be the same

    const lastPosition = perimeter[perimeter.length - 1];
    const isLastPositionEqualToFirst =
      lastPosition[0] === perimeter[0][0] &&
      lastPosition[1] === perimeter[0][1];

    if (!isLastPositionEqualToFirst) {
      return;
    }

    // fetching from the server

    setState(
      {
        url: "/vehicles/getVehiclesByPerimeter",
        method: "POST",
        body: { perimeter },
        headers: {
          "Content-Type": "application/json",
        },
      },
      setSelectedVehicles
    );
  }, [perimeter, setState]);

  useEffect(() => {
    fetchVehiclesByPerimeter();
  }, [fetchVehiclesByPerimeter]);

  return (
    <div className={classes.tracker}>
      <div id="map" className={classes.map}></div>
      <ul>
        {selectedVehicles.map((vehicleId) => (
          <Car key={vehicleId} carId={vehicleId} />
        ))}
      </ul>
    </div>
  );
};

export default VehicleTracker;