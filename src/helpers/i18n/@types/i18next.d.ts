import "i18next";

import type { defaultNS, resources } from "../config";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNS;

		resources: (typeof resources)["ko"];
	}
}
