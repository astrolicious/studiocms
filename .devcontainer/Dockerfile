FROM mcr.microsoft.com/devcontainers/javascript-node:1-20@sha256:f28172ab4f8cf57dacadc4d2aecf6d108bd9881617bd133b16ddcff6e6eef340

# Enable Proto
RUN curl -fsSL https://moonrepo.dev/install/proto.sh | bash -s -- --yes

# Change default Node version
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install 20.14.0"

# Enable corepack (incase proto fails)
RUN corepack enable pnpm

# Copy welcome message
COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt
