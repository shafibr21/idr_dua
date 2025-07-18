import sqlite3
import requests
import json
import os

# Your Supabase configuration
SUPABASE_URL = "https://ktmnpavbvbzkfhmwkjay.supabase.co"
SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Ciu9WZWMd_aV3Qcx9kdh8w_LY37OiyY"

def insert_to_supabase(table_name, data):
    """Insert data into Supabase table"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    headers = {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": f"Bearer {SUPABASE_PUBLISHABLE_KEY",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response

def migrate_sqlite_to_supabase(sqlite_file_path):
    """Migrate data from SQLite to Supabase"""
    
    # Connect to SQLite database
    conn = sqlite3.connect(sqlite_file_path)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"Found tables: {tables}")
    
    # Table mapping (SQLite table name -> Supabase table name)
    table_mapping = {
        # Update these mappings based on your actual SQLite table structure
        'category': 'categories',
        'sub_category': 'subcategories', 
        'dua': 'duas',
        # Add more mappings as needed
    }
    
    for sqlite_table in tables:
        if sqlite_table in table_mapping:
            supabase_table = table_mapping[sqlite_table]
            print(f"\nMigrating {sqlite_table} -> {supabase_table}")
            
            # Get all data from SQLite table
            cursor.execute(f"SELECT * FROM {sqlite_table}")
            rows = cursor.fetchall()
            
            # Convert rows to list of dictionaries
            data = []
            for row in rows:
                row_dict = dict(row)
                
                # Map column names if needed (update based on your schema)
                if sqlite_table == 'category':
                    mapped_row = {
                        'id': row_dict.get('cat_id') or row_dict.get('id'),
                        'name': row_dict.get('cat_name_bn') or row_dict.get('name'),
                        'name_en': row_dict.get('cat_name_en') or row_dict.get('name_en'),
                        'subcategories_count': row_dict.get('no_of_subcat') or 0,
                        'duas_count': row_dict.get('no_of_dua') or 0,
                        'icon': '📖'  # Default icon
                    }
                elif sqlite_table == 'sub_category':
                    mapped_row = {
                        'id': row_dict.get('subcat_id') or row_dict.get('id'),
                        'category_id': row_dict.get('cat_id') or row_dict.get('category_id'),
                        'name': row_dict.get('subcat_name_bn') or row_dict.get('name'),
                        'name_en': row_dict.get('subcat_name_en') or row_dict.get('name_en'),
                        'duas_count': row_dict.get('no_of_dua') or 0
                    }
                elif sqlite_table == 'dua':
                    mapped_row = {
                        'id': row_dict.get('dua_id') or row_dict.get('id'),
                        'subcategory_id': row_dict.get('subcat_id') or row_dict.get('subcategory_id'),
                        'title': row_dict.get('dua_name_bn') or row_dict.get('title'),
                        'title_en': row_dict.get('dua_name_en') or row_dict.get('title_en'),
                        'arabic_text': row_dict.get('top_bn') or row_dict.get('arabic_text'),
                        'transliteration': row_dict.get('transliteration_bn') or row_dict.get('transliteration'),
                        'translation': row_dict.get('translation_bn') or row_dict.get('translation'),
                        'reference': row_dict.get('refference_bn') or row_dict.get('reference'),
                        'audio_url': row_dict.get('audio') or row_dict.get('audio_url')
                    }
                else:
                    mapped_row = row_dict
                
                # Remove None values
                mapped_row = {k: v for k, v in mapped_row.items() if v is not None}
                data.append(mapped_row)
            
            if data:
                print(f"Inserting {len(data)} records...")
                
                # Insert in batches of 100
                batch_size = 100
                for i in range(0, len(data), batch_size):
                    batch = data[i:i + batch_size]
                    response = insert_to_supabase(supabase_table, batch)
                    
                    if response.status_code in [200, 201]:
                        print(f"✅ Successfully inserted batch {i//batch_size + 1}")
                    else:
                        print(f"❌ Error inserting batch {i//batch_size + 1}: {response.text}")
            else:
                print("No data to insert")
    
    conn.close()
    print("\n🎉 Migration completed!")

if __name__ == "__main__":
    # Update this path to your SQLite file
    sqlite_file = "dua_main.sqlite"
    
    if os.path.exists(sqlite_file):
        migrate_sqlite_to_supabase(sqlite_file)
    else:
        print(f"SQLite file '{sqlite_file}' not found!")
        print("Please make sure the file is in the same directory as this script.")
