import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle, LoadScript } from '@react-google-maps/api';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBmTq5KtCI7lgeMHJgO6o_5vXAqz6keukA'; // Reemplaza esto con tu clave de API

const mapContainerStyle = {
  width: '100%',
  height: '98vh',
};

const defaultCenter = {
  lat: -16.406884,
  lng: -71.537302,
};

function Map() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://helpmeapiflask-efc67391556e.herokuapp.com/get_location');

        // Verifica que la respuesta tenga los campos esperados
        if (response.data.latitude !== undefined && response.data.longitude !== undefined) {
          console.log('Coordenadas recibidas:', response.data.latitude, response.data.longitude);

          setLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
          });
        } else {
          console.error('La respuesta no contiene datos de ubicación');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    // Llama a fetchData cada 5 segundos
    const intervalId = setInterval(fetchData, 5000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Muestra el mapa siempre
  return (
    <div>
      <div></div>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location ? { lat: location.latitude, lng: location.longitude } : defaultCenter}
            zoom={location ? 15 : 10} // Ajusta el zoom según tus necesidades
          >
            {location && (
              <>
                <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                <Circle
                  center={{ lat: location.latitude, lng: location.longitude }}
                  radius={200} // Establece el radio del círculo en metros (ajusta según tus necesidades)
                  options={{
                    fillColor: '#FF0000', // Color de relleno del círculo
                    fillOpacity: 0.3, // Opacidad del relleno
                    strokeColor: '#FF0000', // Color del borde
                    strokeOpacity: 1, // Opacidad del borde
                    strokeWeight: 1, // Ancho del borde
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
}

export default Map;
