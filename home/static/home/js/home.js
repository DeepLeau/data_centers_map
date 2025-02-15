document.addEventListener("DOMContentLoaded", function () {

    const map = L.map('map').setView([46.603354, 1.888334], 7);
    const mapContainer = document.getElementById("map");
    const sidebar = document.getElementById("sidebar");
    const sidebarContentContainer = document.querySelector("#sidebar .content");
    const openBtn = document.getElementById("open-btn");

    let departmentScores = {};  

    fetch("/departements_scores/")
        .then(response => response.json())
        .then(data => {
            departmentScores = data;  
            console.log("Scores chargés :", departmentScores);

           
            loadMap();
        })
        .catch(error => console.error("Erreur lors du chargement des scores :", error));

    function loadMap() {
        fetch("https://france-geojson.gregoiredavid.fr/repo/departements.geojson")
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function (feature) {
                        const departmentName = feature.properties.nom;
                        const score = departmentScores[departmentName] || 0;
                        const fillColor = getColorByScore(score);

                        return {
                            color: "#333",
                            weight: 1,
                            fillColor: fillColor,
                            fillOpacity: 0.7
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            mouseover: function (e) {
                                const departmentName = feature.properties.nom;
                                const score = departmentScores[departmentName] || 0;
                                const fillColor = getColorByScore(score);

                                e.target.setStyle({
                                    fillColor: fillColor,
                                    fillOpacity: 1
                                });

                                showPopup(departmentName, score, event);
                            },
                            mouseout: function (e) {
                                const departmentName = feature.properties.nom;
                                const score = departmentScores[departmentName] || 0;
                                e.target.setStyle({
                                    fillColor: getColorByScore(score),
                                    fillOpacity: 0.7
                                });
                            },
                            click: function (e) {
                                showDepartmentInfo(feature);
                            }
                        });
                    }
                }).addTo(map);
            })
            .catch(error => console.error("Erreur lors du chargement du GeoJSON :", error));
    }

    function showPopup(title, score, event) {
        const popup = document.getElementById("custom-popup");
        const popupTitle = document.getElementById("popup-title");
        const popupDescription = document.getElementById("popup-description");

        if (popup) {
            popupTitle.textContent = title;
            popupDescription.textContent = `Score: ${score}`;
            popup.classList.add("show");
        }
    }

    function updatePopupPosition(event) {
        const popup = document.getElementById("custom-popup");

        if (popup) {
            popup.style.left = event.clientX + "px";
            popup.style.top = event.clientY + "px";
        }
    }

    mapContainer.addEventListener('mousemove', e => {
        updatePopupPosition(e);
    });

    mapContainer.addEventListener('mouseout', e => {
        closePopup();
    });

    window.closePopup = function () {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.classList.remove("show");
        }
    };

    openBtn.addEventListener("click", function () {
        sidebar.classList.toggle('active');
    });

    function showDepartmentInfo(feature) {
        const departmentName = feature.properties.nom;
        const departmentScore = departmentScores[departmentName] || "Non défini";

        const sidebarContent = `
            <h3>${departmentName}</h3>
            <p><strong>Score:</strong> ${departmentScore}</p>
            <p><strong>Informations supplémentaires:</strong> Autres données ici.</p>
        `;

        sidebarContentContainer.innerHTML = sidebarContent;
        sidebar.classList.add('active');
    }

    function getColorByScore(score) {
        if (score >= 95) {
            return "#006400"; 
        } else if (score >= 90) {
            return "#32CD32"; 
        } else if (score >= 85) {
            return "#ADFF2F"; 
        } else if (score >= 80) {
            return "#FFFF00"; 
        } else if (score >= 75) {
            return "#FFD700"; 
        } else if (score >= 70) {
            return "#FFA500"; 
        } else if (score >= 65) {
            return "#FF4500"; 
        } else if (score >= 60) {
            return "#FF6347"; 
        } else if (score >= 55) {
            return "#FF0000"; 
        } else {
            return "#B22222"; 
        }
    }
});
