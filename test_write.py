import os
import json

output_dir = "/workspace/reports"
output_file = os.path.join(output_dir, "test_output.json")

try:
    os.makedirs(output_dir, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump({"status": "success", "message": "Test file created."}, f, indent=4)
    print(f"Successfully wrote to {output_file}")
except Exception as e:
    print(f"Error writing test file: {e}")