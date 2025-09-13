{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    python3
    poetry
    redis
    # gcc.cc.lib
  ];

  # export LD_LIBRARY_PATH=${pkgs.gcc.cc.lib}/lib:$LD_LIBRARY_PATH

  shellHook = ''
    echo "🐍 Python3 + Poetry development environment"
    echo "Python version: $(python --version)"
    echo "Poetry version: $(poetry --version)"
    echo ""
    echo "📦 Available commands:"
    echo "  • poetry init - Initialize new project"
    echo "  • poetry install - Install dependencies"
    echo "  • poetry add <package> - Add dependency"
    echo "  • poetry remove <package> - Remove dependency"
    echo "  • poetry update <package> - Update dependency"
    echo "  • poetry update - Update all dependencies"
    echo "  • poetry remove <package> - Remove dependency"
    echo "  • poetry env use python - To activate environment"
    echo "  • poetry run python - Run Python in venv"
    echo ""
  '';

  POETRY_PYTHON = "${pkgs.python3}/bin/python";

  POETRY_VENV_IN_PROJECT = "1";  # Create .venv in project dir
  POETRY_CACHE_DIR = ".poetry-cache";  # Cache dir
}