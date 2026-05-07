{ pkgs ? import <nixpkgs> {} }:

let
  # Common libraries needed by Chromium/Playwright
  browserDeps = with pkgs; [
    at-spi2-atk
    atk
    cairo
    cups
    dbus
    expat
    fontconfig
    freetype
    gdk-pixbuf
    glib
    gtk3
    libGL
    libX11
    libXcomposite
    libXcursor
    libXdamage
    libXext
    libXfixes
    libXi
    libXrandr
    libXrender
    libXtst
    libdrm
    libgbm
    libuuid
    libxcb
    libxkbcommon
    mesa
    nspr
    nss
    pango
  ];
in
pkgs.mkShell {
  packages = with pkgs; [
    python314
    poetry
    redis
    nodejs_20
    gnupg
  ];

  shellHook = ''
    echo "🐍 Python3 + Poetry + Node.js development environment"
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath browserDeps}:$LD_LIBRARY_PATH
    
    # Ensure GPG can find the TTY for password prompts
    export GPG_TTY=$(tty)

    echo ""
    echo "📦 Available commands:"
    echo "  • poetry install - Install Python dependencies"
    echo "  • npm install    - Install Node.js dependencies"
    echo "  • git commit -S  - Signed commits (GPG ready)"
    echo ""
  '';

  POETRY_PYTHON = "${pkgs.python314}/bin/python";
  POETRY_VENV_IN_PROJECT = "1";
  POETRY_CACHE_DIR = ".poetry-cache";
}