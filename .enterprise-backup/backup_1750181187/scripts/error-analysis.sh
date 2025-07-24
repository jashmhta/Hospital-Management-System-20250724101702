#!/bin/bash

# error-analysis.sh
# A script to analyze TypeScript errors in the codebase and generate reports

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORTS_DIR="$BASE_DIR/reports"
SRC_DIR="$BASE_DIR/src"

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"
echo "Created reports directory: $REPORTS_DIR"

# Function to log progress
log_progress() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1"
}

# Generate a report of all TypeScript error types and their counts
generate_error_types_report() {
  log_progress "Generating TypeScript error types report"
  npx tsc --noEmit 2>&1 | grep -o "error TS[0-9]*" | sort | uniq -c | sort -nr > "$REPORTS_DIR/typescript-error-types-count.txt"
  log_progress "TypeScript error types report generated: $REPORTS_DIR/typescript-error-types-count.txt"
}

# Generate a report of files with the most errors
generate_files_with_most_errors_report() {
  log_progress "Generating report of files with the most errors"
  
  # Create a temporary file to store results
  temp_file=$(mktemp)
  
  # Find all TypeScript files
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | while read -r file; do
    # Count errors in the file
    errors=$(npx tsc "$file" --noEmit 2>&1 | grep -c "error TS" || echo "0")
    # Write to temporary file
    echo "$errors $file" >> "$temp_file"
  done
  
  # Sort by error count and save to report
  sort -nr "$temp_file" | head -100 > "$REPORTS_DIR/files-with-most-errors.txt"
  
  # Clean up
  rm "$temp_file"
  
  log_progress "Files with most errors report generated: $REPORTS_DIR/files-with-most-errors.txt"
}

# Generate a report of common error patterns
generate_error_patterns_report() {
  log_progress "Generating common error patterns report"
  
  # Create the report file
  error_patterns_file="$REPORTS_DIR/common-error-patterns.txt"
  
  echo "Common Error Patterns in the Codebase" > "$error_patterns_file"
  echo "===================================" >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  # Check for semicolons in object literals
  echo "1. Semicolons in Object Literals" >> "$error_patterns_file"
  echo "----------------------------" >> "$error_patterns_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "[a-zA-Z0-9_]\+: [^{;]*;" | head -10 >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  # Check for semicolons after function parameter lists
  echo "2. Semicolons After Function Parameter Lists" >> "$error_patterns_file"
  echo "---------------------------------------" >> "$error_patterns_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "function [a-zA-Z0-9_]\+([^)]*));" | head -10 >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  # Check for unterminated string literals
  echo "3. Unterminated String Literals" >> "$error_patterns_file"
  echo "----------------------------" >> "$error_patterns_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "\"[^\"]*$" | head -10 >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  # Check for incorrect template literals
  echo "4. Incorrect Template Literals" >> "$error_patterns_file"
  echo "----------------------------" >> "$error_patterns_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "\`[^{]*\${[^}]*[^}]*\`" | head -10 >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  # Check for incorrect export syntax
  echo "5. Incorrect Export Syntax" >> "$error_patterns_file"
  echo "------------------------" >> "$error_patterns_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "export default const" | head -10 >> "$error_patterns_file"
  echo "" >> "$error_patterns_file"
  
  log_progress "Common error patterns report generated: $error_patterns_file"
}

# Generate a report of code structure issues
generate_code_structure_report() {
  log_progress "Generating code structure report"
  
  # Create the report file
  code_structure_file="$REPORTS_DIR/code-structure-issues.txt"
  
  echo "Code Structure Issues in the Codebase" > "$code_structure_file"
  echo "===================================" >> "$code_structure_file"
  echo "" >> "$code_structure_file"
  
  # Check for files with mismatched braces
  echo "1. Files with Mismatched Braces" >> "$code_structure_file"
  echo "----------------------------" >> "$code_structure_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | while read -r file; do
    # Count opening and closing braces
    open_braces=$(grep -o "{" "$file" | wc -l)
    close_braces=$(grep -o "}" "$file" | wc -l)
    
    # If there are more opening braces than closing braces, add to report
    if [ "$open_braces" -ne "$close_braces" ]; then
      echo "$file: $open_braces opening braces, $close_braces closing braces" >> "$code_structure_file"
    fi
  done | head -20 >> "$code_structure_file"
  echo "" >> "$code_structure_file"
  
  # Check for files with incorrect interface declarations
  echo "2. Files with Incorrect Interface Declarations" >> "$code_structure_file"
  echo "----------------------------------------" >> "$code_structure_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "interface [a-zA-Z0-9_]\+ {.*};" | head -20 >> "$code_structure_file"
  echo "" >> "$code_structure_file"
  
  # Check for files with incorrect class declarations
  echo "3. Files with Incorrect Class Declarations" >> "$code_structure_file"
  echo "------------------------------------" >> "$code_structure_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "class [a-zA-Z0-9_]\+ {.*};" | head -20 >> "$code_structure_file"
  echo "" >> "$code_structure_file"
  
  log_progress "Code structure report generated: $code_structure_file"
}

# Generate a summary report
generate_summary_report() {
  log_progress "Generating summary report"
  
  # Create the report file
  summary_file="$REPORTS_DIR/error-summary.txt"
  
  echo "TypeScript Error Summary" > "$summary_file"
  echo "======================" >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Count total TypeScript errors
  total_errors=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
  echo "Total TypeScript Errors: $total_errors" >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Count files with errors
  files_with_errors=$(find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | while read -r file; do
    npx tsc "$file" --noEmit 2>&1 | grep -q "error TS" && echo "$file"
  done | wc -l)
  echo "Files with TypeScript Errors: $files_with_errors" >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Count total TypeScript files
  total_files=$(find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | wc -l)
  echo "Total TypeScript Files: $total_files" >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Calculate percentage of files with errors
  percentage=$(( (files_with_errors * 100) / total_files ))
  echo "Percentage of Files with Errors: $percentage%" >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Top 10 error types
  echo "Top 10 Error Types:" >> "$summary_file"
  npx tsc --noEmit 2>&1 | grep -o "error TS[0-9]*" | sort | uniq -c | sort -nr | head -10 >> "$summary_file"
  echo "" >> "$summary_file"
  
  # Top 10 files with most errors
  echo "Top 10 Files with Most Errors:" >> "$summary_file"
  find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | while read -r file; do
    errors=$(npx tsc "$file" --noEmit 2>&1 | grep -c "error TS" || echo "0")
    echo "$errors $file"
  done | sort -nr | head -10 >> "$summary_file"
  echo "" >> "$summary_file"
  
  log_progress "Summary report generated: $summary_file"
}

# Main execution
log_progress "Starting TypeScript error analysis"
generate_error_types_report
generate_files_with_most_errors_report
generate_error_patterns_report
generate_code_structure_report
generate_summary_report
log_progress "TypeScript error analysis completed"