import os
import sys
import subprocess
import re

def read_file_content(file_path):
    """Read content from a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        return "Error: File not found"
    except Exception as e:
        return f"Error reading file: {str(e)}"

def create_expandable_section(title, content):
    """Create a markdown expandable section."""
    return f"""<details>
<summary><b>{title}</b> (click to expand)</summary>

{content}

</details>
"""

def update_readme():
    # Paths to the README files
    main_readme_path = 'README.md'
    pykeyboard_readme_path = 'pykeyboard/README.md'
    pyrogram_patch_readme_path = 'pyrogram_patch/README.md'
    
    # Read the content of each README
    pykeyboard_content = read_file_content(pykeyboard_readme_path)
    pyrogram_patch_content = read_file_content(pyrogram_patch_readme_path)
    
    # Create expandable sections
    pykeyboard_section = create_expandable_section("PyKeyboard", pykeyboard_content)
    pyrogram_patch_section = create_expandable_section("Pyrogram Patch", pyrogram_patch_content)
    
    # Read the main README
    with open(main_readme_path, 'r', encoding='utf-8') as file:
        readme_content = file.read()
    
    # Create the new usage section
    new_usage_section = f"""# Usage

{pykeyboard_section}

{pyrogram_patch_section}
"""
    
    # Remove any existing Usage section and expandable sections entirely
    # First, remove any existing # Usage section and everything after it
    usage_pattern = r'\n# Usage.*$'
    readme_content = re.sub(usage_pattern, '', readme_content, flags=re.DOTALL)
    
    # Also remove any orphaned expandable sections that might exist
    details_pattern = r'\n<details>.*?</details>\n*'
    readme_content = re.sub(details_pattern, '', readme_content, flags=re.DOTALL)
    
    # Clean up any trailing whitespace/newlines
    readme_content = readme_content.rstrip()
    
    # Add the new usage section
    new_readme_content = readme_content + '\n\n' + new_usage_section
    
    # Write the updated content back to README.md
    with open(main_readme_path, 'w', encoding='utf-8') as file:
        file.write(new_readme_content)
    
    print("README.md has been updated successfully!")
    
    # Stage the updated README.md
    try:
        subprocess.run(['git', 'add', 'README.md'], check=True)
        print("Successfully staged README.md")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"Error staging README.md: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(update_readme())