import os
import subprocess
import hashlib
import json
import sys

def get_file_info(file_path):
    """Gets size, SHA256, and line count for a given file."""
    try:
        size = os.path.getsize(file_path)
        
        with open(file_path, 'rb') as f:
            sha256_hash = hashlib.sha256(f.read()).hexdigest()
        
        # Count lines of code
        loc_output = subprocess.run(['wc', '-l', file_path], capture_output=True, text=True, check=True)
        loc = int(loc_output.stdout.split()[0])
        
        return size, sha256_hash, loc
    except Exception as e:
        print(f"Error processing file {file_path}: {e}", file=sys.stderr) # Print to stderr for debugging
        return None, None, None

def infer_language(file_path):
    """Infers programming language based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.js': return 'JavaScript'
    if ext == '.ts': return 'TypeScript'
    if ext == '.jsx': return 'JSX'
    if ext == '.tsx': return 'TSX'
    if ext == '.py': return 'Python'
    if ext == '.java': return 'Java'
    if ext == '.c': return 'C'
    if ext == '.cpp': return 'C++'
    if ext == '.cs': return 'C#'
    if ext == '.go': return 'Go'
    if ext == '.rb': return 'Ruby'
    if ext == '.php': return 'PHP'
    if ext == '.html': return 'HTML'
    if ext == '.css': return 'CSS'
    if ext == '.scss': return 'SCSS'
    if ext == '.json': return 'JSON'
    if ext == '.xml': return 'XML'
    if ext == '.yaml' or ext == '.yml': return 'YAML'
    if ext == '.md': return 'Markdown'
    if ext == '.sql': return 'SQL'
    if ext == '.sh': return 'Shell'
    if ext == '.dockerfile': return 'Dockerfile'
    if ext == '.env': return 'Environment Variables'
    if ext == '.gitattributes' or ext == '.gitignore': return 'Git Config'
    if ext == '.npmignore': return 'NPM Config'
    if ext == '.editorconfig': return 'Editor Config'
    if ext == '.prettierrc': return 'Prettier Config'
    if ext == '.eslintrc': return 'ESLint Config'
    if ext == '.babelrc': return 'Babel Config'
    if ext == '.tsconfig.json': return 'TypeScript Config'
    if ext == '.webpack.config.js': return 'Webpack Config'
    if ext == '.package.json': return 'NPM Package Config'
    if ext == '.lock': return 'Lock File' # package-lock.json, yarn.lock
    if ext == '.log': return 'Log File'
    if ext == '.txt': return 'Text'
    if ext == '.png' or ext == '.jpg' or ext == '.jpeg' or ext == '.gif' or ext == '.svg': return 'Image'
    if ext == '.pdf': return 'PDF'
    if ext == '.zip' or ext == '.tar' or ext == '.gz': return 'Archive'
    if ext == '.exe' or ext == '.dll': return 'Executable/DLL'
    return 'Unknown'

def generate_manifest(root_dir, output_file_path):
    """Generates a manifest of all files in the given directory and saves it to a file."""
    manifest = []
    print(f"Starting manifest generation for directory: {root_dir}", file=sys.stderr)
    if not os.path.exists(root_dir):
        print(f"Error: Root directory '{root_dir}' does not exist.", file=sys.stderr)
        return
    
    for dirpath, _, filenames in os.walk(root_dir):
        # print(f"  Traversing directory: {dirpath}", file=sys.stderr) # Too verbose for large repos
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            
            # Skip symbolic links to avoid infinite loops or errors
            if os.path.islink(file_path):
                # print(f"    Skipping symbolic link: {file_path}", file=sys.stderr)
                continue

            # Skip non-regular files (e.g., directories, pipes, sockets)
            if not os.path.isfile(file_path):
                # print(f"    Skipping non-regular file: {file_path}", file=sys.stderr)
                continue

            relative_path = os.path.relpath(file_path, root_dir)
            
            size, sha256_hash, loc = get_file_info(file_path)
            language = infer_language(file_path)
            
            if size is not None:
                manifest.append({
                    'path': relative_path,
                    'size_bytes': size,
                    'sha256': sha256_hash,
                    'language': language,
                    'loc': loc
                })
                # print(f"    Added file to manifest: {relative_path}", file=sys.stderr) # Too verbose
            # else:
                # print(f"    Failed to get info for file: {file_path}", file=sys.stderr) # Keep this for specific file errors
    
    print(f"Finished traversing directories. Total files found for manifest: {len(manifest)}", file=sys.stderr)

    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    try:
        with open(output_file_path, 'w') as f:
            json.dump(manifest, f, indent=4)
        print(f"Generated manifest for {len(manifest)} files and saved to {output_file_path}", file=sys.stderr)
    except Exception as e:
        print(f"Error saving manifest to {output_file_path}: {e}", file=sys.stderr)
    
    print(f"Manifest generation complete.", file=sys.stderr)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python generate_manifest.py <root_directory> <output_file_path>", file=sys.stderr)
        sys.exit(1)
    
    root_directory = sys.argv[1]
    output_file = sys.argv[2]
    
    generate_manifest(root_directory, output_file)