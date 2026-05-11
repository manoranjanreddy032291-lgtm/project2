// mapboxgl.accessToken = window.mapToken;

// if (typeof coordinates !== "undefined" && Array.isArray(coordinates)) {
//     const map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v12',
//         center: coordinates,
//         zoom: 9
//     });
// console.log(coordinates);
//     const popup = new mapboxgl.Popup({ offset: 25 })
//         .setHTML(`<h5>welcome</h5>`);

//     new mapboxgl.Marker({ color: 'red' })
//         .setLngLat(coordinates)
//         .setPopup(popup) // attach popup to marker
//         .addTo(map);

//     //  const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
//     //     .setLngLat(e.lngLat)
//     //     .setHTML("<h1>Hello World!</h1>")
//     //     .setMaxWidth("300px")
//     //     .addTo(map);

// } else {
//     console.error("Coordinates are not defined or invalid.");
// }
mapboxgl.accessToken = window.mapToken;

if (!window.mapToken) {
  console.error("Map token is missing. Check your .env file.");
} else if (!Array.isArray(window.coordinates) || window.coordinates.length !== 2) {
  console.error("Coordinates invalid:", window.coordinates);
} else {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: window.coordinates,
    zoom: 9
  });

  map.addControl(new mapboxgl.NavigationControl());

  const marker = document.createElement('div');
    marker.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/684/684908.png)';

  
   marker.style.width = '40px';
  marker.style.height = '40px';
  marker.style.backgroundSize = 'cover';
  marker.style.cursor = 'pointer';
  marker.style.borderRadius = '50%';
  marker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`
      <h4 style="margin:0 0 4px 0;">${window.location_name}</h4>
      <p style="margin:0; color:gray; font-size:13px;">Exact Location provided after booking</p>
    `);

  new mapboxgl.Marker(marker)
    .setLngLat(window.coordinates)
    .setPopup(popup)
    .addTo(map);
}