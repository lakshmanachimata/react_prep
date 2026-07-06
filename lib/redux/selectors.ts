// Memoized selectors for ReduxDemo — derived values from one or more slices.
// createSelector caches the result until input slices change (perf + consistency).
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/redux/store";

const selectCount = (state: RootState) => state.counter.count;
const selectTheme = (state: RootState) => state.ui.theme;

// Single-slice derived value.
export const selectDoubleCount = createSelector([selectCount], (count) => count * 2);

// Cross-slice derived value — reads both counter and ui.
export const selectCounterSummary = createSelector(
  [selectCount, selectTheme],
  (count, theme) => `count=${count}, theme=${theme}`,
);
