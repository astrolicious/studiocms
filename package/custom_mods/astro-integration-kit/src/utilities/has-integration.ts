import type { HookParameters } from "astro";
import { AstroError } from "astro/errors";

type HasIntegrationParams = (
	| { position?: undefined; relativeTo?: string }
	| { position: "before" | "after"; relativeTo: string }
) & {
	name: string;
	config: HookParameters<"astro:config:setup">["config"];
};

/**
 * Checks whether an integration is already installed.
 *
 * If `before` is given, returns true only if the integration is installed before the named|provided integration.
 * If `after` is given, returns true only if the integration is installed after the named|provided integration.
 *
 * @param {object} params
 * @param {string} params.name - Integration to look up.
 * @param {undefined | "before" | "after"} params.position - Position in relation to another integration to check.
 * @param {undefined | string} params.relativeTo - Other integration to check for relative poisition.
 * @param {config} params.config
 *
 * @returns {boolean}
 *
 * @throws {AstroError} When `params.position` is defined but `params.relativeTo` isn't.
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
 *
 * @example
 * ```ts
 * hasIntegration({
 * 		name: "@astrojs/tailwind",
 * 		config
 * })
 * ```
 */
export const hasIntegration = ({
	name,
	position,
	relativeTo,
	config,
}: HasIntegrationParams): boolean => {
	const integrationPosition = config.integrations.findIndex(
		(integration) => integration.name === name,
	);

	// Integration is not installed
	if (integrationPosition === -1) return false;

	// Not a relative check, the integration is present.
	if (position === undefined) return true;

	if (relativeTo === undefined)
		throw new AstroError(
			"Cannot perform a relative integration check without a relative reference.",
			"Pass `relativeTo` on your call to `hasIntegration` or remove the `position` option.",
		);

	const otherPosition = config.integrations.findIndex(
		(integration) => integration.name === relativeTo,
	);

	if (otherPosition === -1)
		throw new AstroError(
			"Cannot check relative position against an absent integration.",
		);

	return position === "before"
		? integrationPosition < otherPosition
		: integrationPosition > otherPosition;
};
