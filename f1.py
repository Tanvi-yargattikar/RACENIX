from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from backend.analytics import F1Analytics

# Initialize Flask with the frontend directory as the static folder
# This ensures all files in /frontend are accessible directly (e.g., /dashboard.html)
app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# Initialize Analytics Service
analytics = F1Analytics(data_dir="data")

@app.route('/', methods=['GET'])
def home():
    # Serve index.html as the root
    return app.send_static_file('index.html')

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(analytics.get_global_stats())

@app.route('/api/years', methods=['GET'])
def get_years():
    return jsonify(analytics.get_global_stats()['years'])

@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    drivers = sorted(analytics.full_df['driver'].unique().tolist())
    return jsonify(drivers)

@app.route('/api/consistency/top10', methods=['GET'])
def get_top10():
    year = request.args.get('year', type=int)
    if not year:
        year = analytics.get_global_stats()['latest_year']
        
    rankings = analytics.get_year_rankings(year)
    top10 = rankings.head(10).to_dict(orient='records')
    return jsonify(top10)

@app.route('/api/drivers/ranking', methods=['GET'])
def get_driver_ranking():
    ranking = analytics.career_ranking.to_dict(orient='records')
    return jsonify(ranking)

@app.route('/api/driver/<name>/detail', methods=['GET'])
def get_driver_detail(name):
    stats = analytics.get_driver_stats(name)
    if not stats:
        return jsonify({"error": "Driver not found"}), 404
    return jsonify(stats)

@app.route('/api/compare', methods=['GET'])
def compare_drivers():
    driver_a = request.args.get('a')
    driver_b = request.args.get('b')
    
    if not driver_a or not driver_b:
        return jsonify({"error": "Two drivers required"}), 400
        
    comparison = analytics.compare_drivers(driver_a, driver_b)
    if not comparison:
        return jsonify({"error": "One or both drivers not found"}), 404
        
    return jsonify(comparison)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
