# Interactive Department Score Map Project

## Project Overview
This Django-based project leverages a SQLite database to power an interactive map displaying various department scores across a region. The map colors each department based on a composite score derived from multiple factors influencing environmental and infrastructural efficiencies.

## Features
- **Interactive Map**: Showcases all departments with colors representing their overall scores, which are computed based on four key factors:
  - **Proximity to Electrical Grid**: Measures the minimum distance from the prefecture to the nearest distribution station.
  - **Internet Exchange Point (IXP)**: Calculates the minimum distance from the prefecture to the nearest IXP node.
  - **Energy Efficiency**: Utilizes the heat diffusion equation, considering a standardized water cooling system across all departments. The efficiency is influenced only by external temperatures, which are predicted up to the year 2100 using a RandomForest algorithm. This prediction incorporates current trends through linear regression to forecast temperature increases.
  - **Wind Power Score**: Represents the total wind farm power available in each department.
- **Search Bar**: Employs the Mistral Nemo-Instruct 2407 to deliver scores for each of the three criteria, highlighting relevant departments based on search results.

## Getting Started
To get this project up and running on your local machine, follow these steps:

### Prerequisites
- Python 3.8 or higher
- Django 3.2 or higher
- Other dependencies listed in `requirements.txt`

### Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/DeepLeau/data_centers_map.git
   ```
2. Navigate to the project directory:
   ```bash
   cd data_centers_map
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   python manage.py runserver
   ```
5. Open your web browser and go to `http://127.0.0.1:8000/` to view the project.

## Usage
- Navigate the map to see the scores for each department.
- Use the search bar to refine the map display based on specific criteria.
- Click on any department to get a detailed breakdown of its scores and metrics.

## Contributing
Contributions to this project are welcome. Please ensure that your pull requests are well-documented and include any necessary updates to tests and documentation.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
