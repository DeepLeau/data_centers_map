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
    const leftSidebar = document.getElementById('left-sidebar');
    const leftSidebarToggle = document.getElementById('left-sidebar-toggle');

    let departmentScores = {};
    let currentActiveLayer = null;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

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

    function getStyleByScore(score) {
        return {
            color: "#fff",
            weight: 1,
            fillColor: getColorByScore(score),
            fillOpacity: 0.7
        };
    }

    function getScoreClass(score) {
        if (score >= 90) return 'score-high';
        if (score >= 75) return 'score-medium';
        return 'score-low';
    }

    function handleMouseOver(e) {
        const layer = e.target;
        const feature = layer.feature;
        const departmentName = feature.properties.nom;
        const score = departmentScores[departmentName]?.score_global || 0;

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
        const score = departmentScores[departmentName]?.score_global || 0;

        layer.setStyle(getStyleByScore(score));
        closePopup();
    }

    function handleClick(e) {
        const layer = e.target;
        const feature = layer.feature;

        if (currentActiveLayer) {
            const prevScore = departmentScores[currentActiveLayer.feature.properties.nom]?.score_global || 0;
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

    function closePopup() {
        const popup = document.getElementById("custom-popup");
        if (popup) {
            popup.classList.remove("show");
        }
    }

    function showDepartmentInfo(feature) {
        const departmentName = feature.properties.nom;
        const departmentData = departmentScores[departmentName] || {};
        
        const scores = [
          { label: 'Éolienne', value: departmentData.score_eolienne },
          { label: 'Énergétique', value: departmentData.score_energetique },
          { label: 'Électrique', value: departmentData.score_elec },
          { label: 'IXP', value: departmentData.score_ixp }
        ];
  
        const sidebarContent = `
          <div class="department-info">
            <div class="department-header">
              <h2>${departmentName}</h2>
              <button onclick="sidebar.classList.remove('active')" class="close-btn">×</button>
            </div>
            <div class="scores-grid">
              ${scores.map(score => `
                <div class="score-card">
                  <div class="score-label">${score.label}</div>
                  <div class="score-value">
                    <div class="progress-ring">
                      <div class="progress-circle" style="--progress: ${score.value || 0}%">
                        <span>${score.value || 'N/D'}${score.value ? '%' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
        sidebarContentContainer.innerHTML = sidebarContent;
        sidebar.classList.add('active');
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

    function updateStatistics() {
        const scores = Object.values(departmentScores).map(dept => dept.score_global).filter(Boolean);
        if (scores.length === 0) return;

        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const sortedScores = [...scores].sort((a, b) => a - b);
        const median = sortedScores[Math.floor(scores.length / 2)];
        const best = Math.max(...scores);
        const worst = Math.min(...scores);

        document.getElementById('average-score').textContent = average.toFixed(1) + '%';
        document.getElementById('median-score').textContent = median.toFixed(1) + '%';
        document.getElementById('best-score').textContent = best.toFixed(1) + '%';
        document.getElementById('worst-score').textContent = worst.toFixed(1) + '%';
    }

    function loadMap() {
        fetch("https://france-geojson.gregoiredavid.fr/repo/departements.geojson")
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function (feature) {
                        const departmentName = feature.properties.nom;
                        const score = departmentScores[departmentName]?.score_global || 0;
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
                console.error("Error while loading GeoJSON file :", error);
                showErrorMessage("Impossible to load the map");
            });
    }

    Promise.all([
        fetch('/departements_scores/').then(response => response.json()),
        fetch('/departements-data/').then(response => response.json())
    ])
    .then(([scores, data]) => {
        departmentScores = data.reduce((acc, dept) => {
            acc[dept.nom] = {
                ...dept,
                score_global: scores[dept.nom] || 0
            };
            return acc;
        }, {});
        
        updateStatistics();
        loadMap();
    })
    .catch(error => {
        console.error("Error while loading datas :", error);
        showErrorMessage("Impossible to load datas for the department");
    });

    openBtn.addEventListener("click", () => {
        sidebar.classList.toggle('active');
        if (!sidebar.classList.contains('active') && currentActiveLayer) {
            const prevScore = departmentScores[currentActiveLayer.feature.properties.nom]?.score_global || 0;
            currentActiveLayer.setStyle(getStyleByScore(prevScore));
            currentActiveLayer = null;
        }
    });

    leftSidebarToggle.addEventListener('click', () => {
        leftSidebar.classList.toggle('active');
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
                const prevScore = departmentScores[currentActiveLayer.feature.properties.nom]?.score_global || 0;
                currentActiveLayer.setStyle(getStyleByScore(prevScore));
                currentActiveLayer = null;
            }
        }
    });

    const searchInput = document.getElementById("search-input");

    function filterDepartments(query) {
        const departmentLayers = map._layers;

        Object.values(departmentLayers).forEach(layer => {
            if (layer.feature && layer.feature.properties) {
                const departmentName = layer.feature.properties.nom.toLowerCase();
                const match = departmentName.includes(query.toLowerCase());

                if (match) {
                    layer.setStyle({
                        opacity: 1, 
                    });
                } else {
                    layer.setStyle({
                        opacity: 0.2, 
                    });
                }
            }
        });
    }

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim();
        filterDepartments(query);
    });
});