FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

# We uninstall pnpm here, since we enable the corepack version in the postCreateCommand
# This ensures we respect the "packageManager" version in package.json
RUN npm uninstall -g pnpm

# Install Proto CLI and it's dependencies
RUN apt-get update && apt-get install -y git unzip gzip xz-utils
RUN curl -fsSL https://moonrepo.dev/install/proto.sh | bash -s -- --yes

COPY welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt