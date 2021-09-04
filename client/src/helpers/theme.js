import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const cols = { lg: 8, md: 6, sm: 4, xs: 4, xxs: 2 };

export const smallWidgetDim = 180;
export function getCurrBr(width) {
  for (var [k, v] of Object.entries(breakpoints)) {
    if (width > v) {
      return k;
    }
  }
}

let theme = createTheme({
  breakpoints: {
    values: { ...breakpoints },
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: 16,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 32,
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
