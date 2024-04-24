mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
 container: 'map', // container ID
center: [12,12], // starting position [lng, lat]
zoom: 9 // starting zoom
});

console.log(coordinates)
const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.addTo(map); 