import json
import numpy as np
from datetime import datetime



def encode_vector(v):
    return v.astype(np.float32).tobytes()

def decode_vector(v):
    return np.frombuffer(v, dtype=np.float32)

def format_hour(timestamp):
    dt = datetime.fromtimestamp(timestamp)
    return dt.strftime("%Y-%m-%d %H:00")

def extract_countries_from_locations(locations_json):
    try:
        locations = json.loads(locations_json)
        return [
            loc['country'] for loc in locations
        ]
    except (json.JSONDecodeError, TypeError):
        return []


def process_document_for_hourly_counts(doc_data, hourly_data):
    try:
        timestamp = int(float(doc_data.get("timestamp")))    
        dt = datetime.fromtimestamp(timestamp)
        hour_key = dt.strftime("%Y-%m-%d %H:00")
        
        if hour_key not in hourly_data:
            hourly_data[hour_key] = {}
        
        
        locations_data = doc_data.get("locations")
        countries = extract_countries_from_locations(locations_data)
        for country in [c for c in countries if c]:
            if country not in hourly_data[hour_key]:
                hourly_data[hour_key][country] = 0
            hourly_data[hour_key][country] += 1
                
    except (ValueError, TypeError):
        pass

def countryCheck(parsed_data, country_name):
    country_match = False
    if "locations" in parsed_data:
        try:
            locations_data = parsed_data.get("locations")
            locations_data = locations_data = json.loads(locations_data)
            for location in locations_data:
                if location.get('country', '').lower() == country_name.lower():
                    country_match = True
                    break
        except Exception as e:
            print(f"Error processing locations: {e}")
    return country_match
