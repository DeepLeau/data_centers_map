document.addEventListener("DOMContentLoaded", function () {
    
    const map = L.map('map').setView([46.603354, 1.888334], 7);
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("open-btn");

    // Map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    fetch("https://france-geojson.gregoiredavid.fr/repo/departements.geojson")
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: "#333",
                        weight: 1,
                        fillColor: "#ccc",
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.on({
                        mouseover: function (e) {
                            e.target.setStyle({
                                fillColor: "#ff5733",
                                fillOpacity: 1
                            });
                        },
                        mouseout: function (e) {
                            e.target.setStyle({
                                fillColor: "#ccc",
                                fillOpacity: 0.7
                            });
                        },
                        click: function () {
                            alert("Département: " + feature.properties.nom);
                        }
                    });
                    layer.bindTooltip(feature.properties.nom);
                }
            }).addTo(map);
        })
        .catch(error => console.error("Erreur lors du chargement du GeoJSON:", error));


        // SideBar
        openBtn.addEventListener("click", function () {
            sidebar.classList.toggle('active')
        });
});
