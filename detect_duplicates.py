import json
import os
import csv

def detect_exact_duplicates(manifest_path, output_csv_path):
    """
    Detects exact duplicate files based on SHA256 hashes from the manifest.
    Outputs results to a CSV file.
    """
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
    except FileNotFoundError:
        print(f"Error: Manifest file not found at {manifest_path}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {manifest_path}")
        return

    sha_map = {}
    for entry in manifest:
        sha = entry.get('sha256')
        path = entry.get('path')
        if sha and path:
            if sha not in sha_map:
                sha_map[sha] = []
            sha_map[sha].append(path)

    duplicates = []
    for sha, paths in sha_map.items():
        if len(paths) > 1:
            # All files with the same SHA are exact duplicates
            for i in range(len(paths)):
                for j in range(i + 1, len(paths)):
                    duplicates.append({
                        'fileA': paths[i],
                        'fileB': paths[j],
                        'similarity_percent': 100.0,
                        'reason': 'Exact duplicate (SHA256 match)'
                    })

    # Ensure the output directory exists
    output_dir = os.path.dirname(output_csv_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    with open(output_csv_path, 'w', newline='') as csvfile:
        fieldnames = ['fileA', 'fileB', 'similarity_percent', 'reason']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(duplicates)
    
    print(f"Exact duplicate analysis complete. Found {len(duplicates)} duplicate pairs.")
    print(f"Results saved to {output_csv_path}")

if __name__ == '__main__':
    # Assuming manifest is in ../reports/file_manifest.json
    # And output should be in ../reports/duplicates.csv
    manifest_file = '../reports/file_manifest.json'
    output_file = '../reports/duplicates.csv'
    
    detect_exact_duplicates(manifest_file, output_file)