const CACHE = new Map();

const styledSym = Symbol("Styled");

function styled(className) {
  if (!CACHE.has(className)) {
    CACHE.set(className, { instances: new Set(), style: null });
  }

  class CustomClass extends className {
    constructor() {
      super();

      const styleEl = document.createElement("style");
      styleEl.id = "global-style";
      this.shadowRoot.appendChild(styleEl);

      CACHE.get(className).instances.add(this);
      if (CACHE.get(className).style) {
        this[styledSym]();
      }
    }

    [styledSym](style) {
      this.shadowRoot.querySelector("#global-style").textContent = style;
    }
  }

  return CustomClass;
}

const updateStyle = function(className, style) {
  CACHE.get(className).style = style;
  CACHE.get(className).instances.forEach(el => el[styledSym](style));
};

Object.defineProperty(styled, "updateStyle", { value: updateStyle });
