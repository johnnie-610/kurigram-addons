import os
import sys
import re
import subprocess

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

def clean_readme_content(content):
    """Clean up the README content by removing all existing expandable sections."""
    import re
    # Remove all expandable sections after the Usage heading
    content = re.sub(
        r'(# Usage\n\n)(<details>.*?</details>\n)*',
        r'\1',
        content,
        flags=re.DOTALL
    )
    # Remove any multiple consecutive newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    return content.strip()

def update_readme():
    # Paths to the README files
    main_readme_path = 'README.md'
    pykeyboard_readme_path = 'pykeyboard/README.md'
    pyrogram_patch_readme_path = 'pyrogram_patch/README.md'
    
    # Read the content of each README
    pykeyboard_content = read_file_content(pykeyboard_readme_path)
    pyrogram_patch_content = read_file_content(pyrogram_patch_readme_path)
    
    # Read and clean the main README
    with open(main_readme_path, 'r', encoding='utf-8') as file:
        readme_content = clean_readme_content(file.read())
    
    # Create expandable sections
    pykeyboard_section = create_expandable_section("PyKeyboard", pykeyboard_content)
    pyrogram_patch_section = create_expandable_section("Pyrogram Patch", pyrogram_patch_content)
    
    # Create the new usage section
    new_usage_section = f"""# Usage

{pykeyboard_section}

{pyrogram_patch_section}
"""
    
    # Insert the new usage section after the installation section or at the end
    if "# Installation" in readme_content:
        # Insert after installation section
        installation_section = re.search(r'(# Installation[\s\S]*?)(?=\n\w|$)', readme_content)
        if installation_section:
            insert_point = installation_section.end()
            new_readme_content = (
                readme_content[:insert_point] + 
                "\n\n" + new_usage_section + 
                readme_content[insert_point:]
            )
        else:
            new_readme_content = readme_content + "\n\n" + new_usage_section
    else:
        # If no installation section, append at the end
        new_readme_content = readme_content + "\n\n" + new_usage_section
    
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