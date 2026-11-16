# 🏎️ RACENIX: Advanced Performance Analytics

A professional-grade Data Analytics & Visualization platform to quantify Formula 1 driver consistency using historical race data (1950 - Present).

Built for recruiters and F1 enthusiasts, this project moves beyond "who won" to "who is most reliable" using normalized variance modeling and weighted performance metrics.

## 🚀 Key Features
- **Normalized Consistency Scoring**: Uses Min-Max scaling to weigh finish position stability (50%), qualifying performance (30%), and points conversion (20%).
- **Reliability Index**: Integrates DNF (Did Not Finish) rates as a reliability penalty in the final score.
- **Head-to-Head Comparison**: Compare any two drivers in history with side-by-side career stats and performance trend correlation charts.
- **World Career Ranking**: A filtered global ranking of all drivers in history with a minimum 20-race eligibility threshold to ensure data integrity.
- **Interactive Visualizations**: Real-time chart animations (Chart.js) and responsive UI with glassmorphism aesthetics.

## 🛠️ Tech Stack
- **Backend**: Python (Flask), Pandas, NumPy
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+), Chart.js
- **Data Engineering**: Multi-stage data merging, cleaning, and complex aggregations.
- **Deployment**: Ready for Render/Heroku with Gunicorn.

## 📊 Methodology
To ensure professional-level insights, the platform implements a three-stage analytical pipeline:
1. **Variance Calculation**: Computing variance for race finish, grid position, and points.
2. **Min-Max Normalization**: Scaling raw variances to a 0.0 - 1.0 range based on global min/max values.
3. **Weighted Fusion**: Combining metrics into a single "Consistency Score" where **lower is superior**.
   - Formula: `(0.5 * NormFinish) + (0.3 * NormQual) + (0.2 * NormPoints) + (0.1 * DNF_Rate)`

## 🎯 Intern / Junior Portfolio Highlights
- **Engineered a scalable data pipeline** using Pandas to aggregate 70+ years of F1 historical data (results, qualifying, drivers, status).
- **Implemented advanced statistical modeling** (Normalization & Weighted Scoring) to create a proprietary "Consistency Metric."
- **Designed a high-performance interactive frontend** featuring real-time data filtering, search, and dynamic Chart.js visualizations.

## 🏁 Future Roadmap
- Integration of a Machine Learning model for race result prediction.
- Real-time API integration with the Ergast F1 API for live updates.
- Deep dive into constructor-specific consistency analysis.

---
## Project Demo



https://github.com/user-attachments/assets/8fe252ee-7246-40ee-a63a-97b2dda47589

*Created by [Your Name] as a demonstration of Full-Stack Data Engineering and Visualization.*
