// Entry point. Load as a dashboard resource (JavaScript module), then create a
// dashboard and pick "ATLAS Home" under Community dashboards (HA 2026.5+), or use:
//   strategy:
//     type: custom:atlas-home
import { STRATEGY_TAG, STRATEGY_TYPE, EDITOR_TAG, VIEW_CARD_TAG, VERSION } from "./config/constants";
import { define } from "./util/navigate";
import { AtlasHomeStrategy } from "./strategy";
import { AtlasStrategyEditor } from "./editor/strategy-editor";
import { AtlasView } from "./ui/atlas-view";

define(STRATEGY_TAG, AtlasHomeStrategy);
define(EDITOR_TAG, AtlasStrategyEditor);
define(VIEW_CARD_TAG, AtlasView);

const w = window as unknown as { customStrategies?: Record<string, unknown>[] };
w.customStrategies = w.customStrategies || [];
if (!w.customStrategies.some((s) => s.type === STRATEGY_TYPE)) {
  w.customStrategies.push({
    type: STRATEGY_TYPE,
    strategyType: "dashboard",
    name: "ATLAS Home",
    description: "Attention-first house dashboard with rooms, alerts and cameras.",
    documentationURL: "https://github.com/robman2026/AttlasDashboard",
  });
}

console.info(`%c ATLAS HOME %c ${VERSION} `, "background:#56E7C0;color:#14171C;font-weight:700", "background:#252A30;color:#F1F5FF");
