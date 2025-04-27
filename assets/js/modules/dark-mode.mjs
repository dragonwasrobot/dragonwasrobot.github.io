const initializeThemeToggle = (window) => {
  /*
   * Returns theme in local storage: "dark" | "light" | undefined.
   * Returns undefined when no theme is currently set.
   */
  const getLocalTheme = (localStorage) => {
    const isLocalThemeSet = "theme" in localStorage;
    if (isLocalThemeSet) {
      return localStorage.theme;
    } else {
      return undefined;
    }
  };

  /*
   * Returns preferred OS theme: "dark" | "light".
   * Defaults to "light" when no preference can be found.
   */
  const getOSTheme = (window) => {
    const isOSThemeDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return isOSThemeDark ? "dark" : "light";
  };

  /*
   * Sets the color theme of the page: "dark" | "light".
   */
  const setTheme = (document, localTheme, osTheme) => {
    const theme = localTheme || osTheme;

    const toggle = document.getElementById("theme-toggle");
    toggle.checked = theme == "light";

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Favicon is purely based on OS preference as the OS is in charge of
    // painting the actual browser tab, so using the local theme could result in
    // invisible favicons due to clashing preferences producing in
    // white-icon-on-white-background.
    const favicon = document.getElementById("favicon");
    favicon.href = osTheme == "dark" ? "/favicon-dark.ico" : "/favicon.ico";
  };

  const initializeToggleEventListener = (window) => {
    const toggle = window.document.getElementById("theme-toggle");
    toggle.addEventListener("change", (e) => {
      const theme = e.target.checked ? "light" : "dark";
      const osTheme = getOSTheme(window);
      setTheme(window.document, theme, osTheme);
    });
  };
  initializeToggleEventListener(window);

  const determineInitialTheme = (window) => {
    const localTheme = getLocalTheme(window.localStorage);
    const osTheme = getOSTheme(window);
    setTheme(window.document, localTheme, osTheme);
  };
  determineInitialTheme(window);
};

export { initializeThemeToggle };
