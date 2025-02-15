document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map', {
        zoomControl: false,
        minZoom: 5,
        maxZoom: 10
    }).setView([46.603354, 1.888334], 7);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    const mapContainer = document.getElementById("map");
    const sidebar = document.getElementById("sidebar");
    const sidebarContentContainer = document.querySelector("#sidebar .content");
    const openBtn = document.getElementById("open-btn");

    let departmentScores = {};
    let currentActiveLayer = null;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    fetch("/departements_scores/")
        .then(response => response.json())
        .then(data => {
            departmentScores = data;
            loadMap();
        })
        .catch(error => {
            console.error("Erreur lors du chargement des scores :", error);
            showErrorMessage("Impossible de charger les données des départements");
        });

    function loadMap() {
        fetch("https://france-geojson.gregoiredavid.fr/repo/departements.geojson")
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function (feature) {
                        const departmentName = feature.properties.nom;
                        const score = departmentScores[departmentName] || 0;
                        return getStyleByScore(score);
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            mouseover: handleMouseOver,
                            mouseout: handleMouseOut,
                            click: handleClick
                        });
                    }
                }).addTo(map);
            })
            .catch(error => {
                console.error("Erreur lors du chargement du GeoJSON :", error);
                showErrorMessage("Impossible de charger la carte");
            });
    }

    function getStyleByScore(score) {
        return {
            color: "#fff",
            weight: 1,
            fillColor: getColorByScore(score),
            fillOpacity: 0.7
        };
    }

    function handleMouseOver(e) {
        const layer = e.target;
        const feature = layer.feature;
        const departmentName = feature.properties.nom;
        const score = departmentScores[departmentName] || 0;

        layer.setStyle({
            weight: 2,
            fillOpacity: 0.9
        });

        showPopup(departmentName, score, e.originalEvent);
        layer.bringToFront();
    }

    function handleMouseOut(e) {
        const layer = e.target;
        const feature = layer.feature;
        const departmentName = feature.properties.nom;
        const score = departmentScores[departmentName] || 0;

        layer.setStyle(getStyleByScore(score));
        closePopup();
    }

    function handleClick(e) {
        const layer = e.target;
        const feature = layer.feature;

        if (currentActiveLayer) {
            const prevScore = departmentScores[currentActiveLayer.feature.properties.nom] || 0;
            currentActiveLayer.setStyle(getStyleByScore(prevScore));
        }

        layer.setStyle({
            weight: 3,
            fillOpacity: 0.9,
            dashArray: '5, 5'
        });

        currentActiveLayer = layer;
        showDepartmentInfo(feature);
    }

    function showPopup(title, score, event) {
        const popup = document.getElementById("custom-popup");
        const popupTitle = document.getElementById("popup-title");
        const popupDescription = document.getElementById("popup-description");

        if (popup) {
            popupTitle.textContent = title;
            popupDescription.textContent = `Score: ${score}%`;
            popup.classList.add("show");
            
            const offset = { x: 10, y: 10 };
            popup.style.left = `${event.pageX + offset.x}px`;
            popup.style.top = `${event.pageY + offset.y}px`;
        }
    }

    function showDepartmentInfo(feature) {
        const departmentName = feature.properties.nom;
        const departmentScore = departmentScores[departmentName] || "Non défini";
        const scoreClass = getScoreClass(departmentScore);

        const sidebarContent = `
            <div class="department-info">
                <h3>${departmentName}</h3>
                <div class="score-display ${scoreClass}">
                    <strong>Score:</strong> ${departmentScore}%
                </div>
                <div class="additional-info">
                    <h4>Informations détaillées</h4>
                    <p>Population: ${feature.properties.code || 'Non disponible'}</p>
                    <p>Superficie: ${feature.properties.code || 'Non disponible'} km²</p>
                </div>
            </div>
        `;

        sidebarContentContainer.innerHTML = sidebarContent;
        sidebar.classList.add('active');
    }

    function getScoreClass(score) {
        if (score >= 90) return 'score-high';
        if (score >= 75) return 'score-medium';
        return 'score-low';
    }

    function closePopup() {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.classList.remove("show");
        }
    }

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h4>Erreur</h4>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Fermer</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function getColorByScore(score) {
        if (score >= 95) return "#006400";
        if (score >= 90) return "#32CD32";
        if (score >= 85) return "#ADFF2F";
        if (score >= 80) return "#FFFF00";
        if (score >= 75) return "#FFD700";
        if (score >= 70) return "#FFA500";
        if (score >= 65) return "#FF4500";
        if (score >= 60) return "#FF6347";
        if (score >= 55) return "#FF0000";
        return "#B22222";
    }

    openBtn.addEventListener("click", function() {
        sidebar.classList.toggle('active');
        if (!sidebar.classList.contains('active') && currentActiveLayer) {
            const prevScore = departmentScores[currentActiveLayer.feature.properties.nom] || 0;
            currentActiveLayer.setStyle(getStyleByScore(prevScore));
            currentActiveLayer = null;
        }
    });

    mapContainer.addEventListener('mousemove', (e) => {
        const popup = document.getElementById("custom-popup");
        if (popup && popup.classList.contains('show')) {
            const offset = { x: 10, y: 10 };
            popup.style.left = `${e.pageX + offset.x}px`;
            popup.style.top = `${e.pageY + offset.y}px`;
        }
    });

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (currentActiveLayer) {
                const prevScore = departmentScores[currentActiveLayer.feature.properties.nom] || 0;
                currentActiveLayer.setStyle(getStyleByScore(prevScore));
                currentActiveLayer = null;
            }
        }
    });
});