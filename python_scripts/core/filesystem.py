import os
import re
from typing import List


def list_directory_files(
        start_path: str,
        file_pattern: str | None = None,
) -> List[str]:
    """Generate a list fo file names in a path

    Works recursively from a start path. Optionally filters by file pattern.
    The generated list is sorted by filename.

    Args:
        start_path: path to start the search
        file_pattern: regex to match files in start_path

    Returns:
        files: sorted list of files with full path name

    """
    files: List[str] = []
    if not os.path.exists(start_path):
        return files

    for filename in os.listdir(start_path):
        # build the full path
        full_path = os.path.join(start_path, filename)

        if os.path.isfile(full_path):
            if file_pattern:
                match = re.match(file_pattern, filename)
                if not match:
                    continue
            files.append(full_path)
        else:
            # it is a directory
            files += list_directory_files(full_path, file_pattern)

    return sorted(files)


def clear_directory(start_path: str) -> None:
    """Delete all files and subdirectories in the path. Works recursively from a start path.

    Args:
        start_path: path to top level directory
    """
    if not os.path.exists(start_path):
        return None

    for filename in os.listdir(start_path):
        # build the full path
        full_path = os.path.join(start_path, filename)

        if os.path.isfile(full_path):
            os.remove(full_path)
        else:
            # it is a directory
            clear_directory(full_path)

    return None
