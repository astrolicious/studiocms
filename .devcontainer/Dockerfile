FROM mcr.microsoft.com/devcontainers/javascript-node:0-20@sha256:a20adf8775b442587c7fe3d5ce6f2f2bc084cd4e9dacc27b1a2d0840f28e57c9

# We uninstall pnpm here, since we enable the corepack version in the postCreateCommand
# This ensures we respect the "packageManager" version in package.json
RUN npm uninstall -g pnpm && nvm install 20.14.0

COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt