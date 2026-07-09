import pandas as pd
import os
import numpy as np

class F1Analytics:
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.full_df = None
        self.df_clean = None
        self.career_ranking = None
        self.load_and_preprocess()

    def load_and_preprocess(self):
        """Loads and cleans the F1 dataset."""
        try:
            drivers = pd.read_csv(os.path.join(self.data_dir, "drivers.csv"))
            races = pd.read_csv(os.path.join(self.data_dir, "races.csv"))
            results = pd.read_csv(os.path.join(self.data_dir, "results.csv"))
            qualifying = pd.read_csv(os.path.join(self.data_dir, "qualifying.csv"))
            status = pd.read_csv(os.path.join(self.data_dir, "status.csv"))

            # Merge results with drivers
            df = results.merge(drivers[['driverId', 'surname', 'forename', 'code']], on='driverId')
            
            # Merge with races
            df = df.merge(races[['raceId', 'year', 'name']], on='raceId')
            
            # Merge with qualifying
            df = df.merge(qualifying[['raceId', 'driverId', 'position']], on=['raceId', 'driverId'], how='left')
            
            # Rename columns
            df.rename(columns={
                'surname': 'driver_surname',
                'forename': 'driver_forename',
                'positionOrder': 'race_position',
                'position_x': 'results_position',
                'position_y': 'qual_position',
                'name': 'race_name'
            }, inplace=True)
            
            # Create full name
            df['driver'] = df['driver_forename'] + " " + df['driver_surname']

            # Basic cleaning
            df['qual_position'] = pd.to_numeric(df['qual_position'], errors='coerce')
            df['race_position'] = pd.to_numeric(df['race_position'], errors='coerce')
            
            # Handle DNFs based on statusId
            # Status IDs: 1 is Finished, 11-14 are +Laps (which count as finished for consistency)
            # Generally, statusId 1 or status starting with "Finished" or "+" is not a DNF
            df = df.merge(status[['statusId', 'status']], on='statusId', how='left')
            df['is_dnf'] = ~df['status'].str.contains('Finished|\+', case=False, na=False)
            
            self.full_df = df
            self.df_clean = df[df['is_dnf'] == False].copy()
            
            # Precompute career ranking to save time
            self.career_ranking = self.calculate_career_rankings()
            
        except Exception as e:
            print(f"Error loading data: {e}")
            raise e

    def normalize_series(self, series):
        """Applies Min-Max Scaling (0 to 1)."""
        if series.max() == series.min():
            return series * 0
        return (series - series.min()) / (series.max() - series.min())

    def calculate_consistency_metrics(self, df_subset, min_races=5):
        """
        Calculates consistency metrics with normalization and DNF rate.
        """
        if df_subset.empty:
            return pd.DataFrame()

        # Group by driver
        stats = (
            df_subset
            .groupby('driver')
            .agg(
                finish_variance=('race_position', 'var'),
                qual_variance=('qual_position', 'var'),
                points_variance=('points', 'var'),
                races=('race_position', 'count'),
                avg_finish=('race_position', 'mean'),
                avg_qual=('qual_position', 'mean'),
                dnf_count=('is_dnf', 'sum')
            )
            .reset_index()
        )

        # Filter by minimum races
        stats = stats[stats['races'] >= min_races].copy()
        
        if stats.empty:
            return pd.DataFrame()

        # Calculate DNF rate
        stats['dnf_rate'] = (stats['dnf_count'] / stats['races']) * 100

        # Fill NaNs in variance (e.g. if only 1 race, variance is NaN)
        stats['finish_variance'] = stats['finish_variance'].fillna(stats['finish_variance'].max() or 0)
        stats['qual_variance'] = stats['qual_variance'].fillna(stats['qual_variance'].max() or 0)
        stats['points_variance'] = stats['points_variance'].fillna(stats['points_variance'].max() or 0)

        # Normalize metrics (Lower variance is better, so 0 is best)
        stats['norm_finish_var'] = self.normalize_series(stats['finish_variance'])
        stats['norm_qual_var'] = self.normalize_series(stats['qual_variance'])
        stats['norm_points_var'] = self.normalize_series(stats['points_variance'])

        # Weighted Score (0 is most consistent, 1 is least)
        stats['consistency_score'] = (
            0.5 * stats['norm_finish_var'] +
            0.3 * stats['norm_qual_var'] +
            0.2 * stats['norm_points_var']
        )
        
        # Reliability Penalty: Add a fraction of DNF rate to the score
        # Since score is 0-1, we scale DNF rate (0-100) to 0-1 and give it weight
        # This makes unreliable drivers have "worse" (higher) consistency scores
        stats['final_score'] = stats['consistency_score'] + (0.1 * (stats['dnf_rate'] / 100))

        return stats.sort_values('final_score')

    def calculate_career_rankings(self):
        """Calculates all-time rankings with a higher race threshold."""
        return self.calculate_consistency_metrics(self.full_df, min_races=20)

    def get_year_rankings(self, year):
        """Calculates rankings for a specific year."""
        year_df = self.full_df[self.full_df['year'] == year]
        return self.calculate_consistency_metrics(year_df, min_races=5)

    def get_driver_stats(self, driver_name):
        """Returns deep-dive stats for a specific driver."""
        driver_df = self.full_df[self.full_df['driver'] == driver_name]
        if driver_df.empty:
            return None

        career = self.career_ranking[self.career_ranking['driver'] == driver_name]
        
        if not career.empty:
            overview = career.to_dict(orient='records')[0]
        else:
            # Fallback for drivers with < 20 races
            temp_stats = self.calculate_consistency_metrics(driver_df, min_races=1)
            if not temp_stats.empty:
                overview = temp_stats.to_dict(orient='records')[0]
            else:
                overview = {
                    'driver': driver_name,
                    'final_score': 0.0,
                    'dnf_rate': 0.0,
                    'races': len(driver_df),
                    'avg_finish': driver_df['race_position'].mean()
                }
        
        # Calculate consistency per year for trend
        trends = []
        driver_years = sorted(driver_df['year'].unique().tolist())
        for year in driver_years:
            year_rankings = self.get_year_rankings(year)
            driver_year = year_rankings[year_rankings['driver'] == driver_name]
            if not driver_year.empty:
                trends.append({
                    'year': int(year),
                    'score': float(driver_year['final_score'].iloc[0]),
                    'rank': int(year_rankings['final_score'].rank().loc[driver_year.index[0]])
                })

        return {
            'overview': overview,
            'yearly_trend': trends,
            'total_races': int(len(driver_df)),
            'seasons': driver_years,
            'avg_grid': float(driver_df['qual_position'].mean()),
            'avg_finish': float(driver_df['race_position'].mean())
        }

    def compare_drivers(self, name_a, name_b):
        """Compares two drivers head-to-head."""
        stats_a = self.get_driver_stats(name_a)
        stats_b = self.get_driver_stats(name_b)
        
        if not stats_a or not stats_b:
            return None
            
        return {
            'driver_a': stats_a,
            'driver_b': stats_b
        }

    def get_global_stats(self):
        return {
            "total_races": int(self.full_df['raceId'].nunique()),
            "total_drivers": int(self.full_df['driver'].nunique()),
            "seasons_count": int(self.full_df['year'].nunique()),
            "latest_year": int(self.full_df['year'].max()),
            "years": sorted(self.full_df['year'].unique().tolist(), reverse=True)
        }
