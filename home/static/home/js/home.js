document.addEventListener("DOMContentLoaded", function () {

    const map = L.map('map').setView([46.603354, 1.888334], 7);
    const mapContainer = document.getElementById("map")
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("open-btn");

    // Commenting or skipping the base map layer for now
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; OpenStreetMap contributors'
    // }).addTo(map);

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
                            showPopup(feature.properties.nom, "Autres Infos...", event);
                        },
                        mouseout: function (e) {
                            e.target.setStyle({
                                fillColor: "#ccc",
                                fillOpacity: 0.7
                            });
                        }
                    });
                }
            }).addTo(map);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));

    function showPopup(title, description, event) {
        const popup = document.getElementById("custom-popup");
        const popupTitle = document.getElementById("popup-title");
        const popupDescription = document.getElementById("popup-description");

        if (popup) {
            popupTitle.textContent = title;
            popupDescription.textContent = description;
            popup.classList.add("show");
        }
    };

    function updatePopupPosition(event) {
        const popup = document.getElementById("custom-popup");
        
        if (popup) {
            popup.style.left = event.clientX + 15 + "px";
            popup.style.top = event.clientY + 15 + "px";
        }
    };

    mapContainer.addEventListener('mousemove', e => {
        updatePopupPosition(e);
    });

    mapContainer.addEventListener('mouseout', e => {
        closePopup();
    });

    window.closePopup = function() {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.classList.remove("show");
        }
    };

    openBtn.addEventListener("click", function () {
        sidebar.classList.toggle('active');
    });
});
