import os
import pathspec

# Set the directory you want to start from
root_dir = r'C:\Users\insta\imn-phone'
output_file = r'C:\Users\insta\imn-phone\file_listing.txt'
gitignore_file = os.path.join(root_dir, '.gitignore')

# Load the .gitignore patterns
with open(gitignore_file, 'r') as f:
    gitignore_patterns = f.read().splitlines()

spec = pathspec.PathSpec.from_lines(pathspec.patterns.GitWildMatchPattern, gitignore_patterns)

# Define additional folders and files to ignore
folders_to_ignore = {'test', 'node_modules', '.git', 'claude'}
files_to_ignore = {'LICENSE', 'ngrok.exe', 'package-lock.json', 'README.md'}

# Open the output file in write mode
with open(output_file, 'w', encoding='utf-8') as out_file:
    # Walk through the directory
    for root, dirs, files in os.walk(root_dir):
        # Skip the specified directories
        dirs[:] = [d for d in dirs if d not in folders_to_ignore]

        for file in files:
            file_path = os.path.relpath(os.path.join(root, file), root_dir)
            
            # Check if the file matches .gitignore patterns or is in the files_to_ignore set
            if spec.match_file(file_path) or file in files_to_ignore:
                continue
            
            # Write file path and contents
            out_file.write(f"File Path: {os.path.join(root, file)}\n")
            out_file.write("Contents:\n")
            try:
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    out_file.write(f.read())
            except Exception as e:
                out_file.write(f"Could not read file: {e}\n")
            out_file.write("\n" + "="*50 + "\n\n")  # Separator between files
