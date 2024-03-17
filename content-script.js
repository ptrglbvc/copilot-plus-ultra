let TOGGLE;

async function getJSONs() {
    let darkModeUrl = chrome.runtime.getURL("dark-mode-css-properties.json");
    let darkRes = await fetch(darkModeUrl);
    let dark = await darkRes.json();

    let lightModeUrl = chrome.runtime.getURL("light-mode-css-properties.json");
    let lightRes = await fetch(lightModeUrl);
    let light = await lightRes.json();

    return [dark, light];
}

const removeDisclaimersAtEndNoSearch = () => {
    const traverseShadowDOM = (element) => {
        if (element && element.shadowRoot) {
            const nestedElement = element.shadowRoot.querySelector(
                "cib-message-attributions"
            );

            if (nestedElement) {
                nestedElement.remove();
            } else {
                const childElements = element.shadowRoot.querySelectorAll("*");
                for (let child of childElements) {
                    traverseShadowDOM(child);
                }
            }
        }
    };

    const rootElement = document.querySelector("cib-serp");
    traverseShadowDOM(rootElement);
};

const removeDisclaimersAtBeginningNoSearch = () => {
    const traverseShadowDOM = (element) => {
        if (element && element.shadowRoot) {
            const nestedElement =
                element.shadowRoot.querySelector("cib-message");

            if (
                nestedElement &&
                nestedElement.getAttribute("type") === "meta"
            ) {
                nestedElement.remove();
            } else {
                const childElements = element.shadowRoot.querySelectorAll("*");
                for (let child of childElements) {
                    traverseShadowDOM(child);
                }
            }
        }
    };

    const rootElement = document.querySelector("cib-serp");
    traverseShadowDOM(rootElement);
};

const addThemeToggle = () => {
    const traverseShadowDOM = (element) => {
        if (element && element.shadowRoot) {
            const nestedElement = element.shadowRoot.querySelector(".header");
            if (nestedElement) {
                let toggleDiv = document.createElement("div");
                toggleDiv.setAttribute("style", "transform: translateX(20%)");
                toggleDiv.setAttribute("class", "dark-mode-toggle");
                let toggle = document.createElement("input");
                TOGGLE = toggle;
                toggle.setAttribute("is", "cib-switch");
                toggle.setAttribute("class", "switch");
                toggle.setAttribute("role", "switch");
                toggle.setAttribute("id", "theme-switch");
                toggle.toggleAttribute("checked");
                toggle.addEventListener("change", () => {
                    if (toggle.checked) {
                        console.log("the theme should be dark now");
                        toggle.toggleAttribute("checked");
                        toggleTheme("dark");
                    } else {
                        toggle.toggleAttribute("checked");
                        toggleTheme("light");
                    }
                });
                toggleDiv.appendChild(toggle);
                nestedElement.appendChild(toggleDiv);
            } else {
                const childElements = element.shadowRoot.querySelectorAll("*");
                childElements.forEach((child) => {
                    traverseShadowDOM(child);
                    return;
                });
            }
        }
    };

    const rootElement = document.querySelector("cib-serp");
    traverseShadowDOM(rootElement);
};

async function toggleTheme(theme) {
    let [darkMode, lightMode] = await getJSONs();
    if (theme === "dark") {
        let root = document.querySelector(":root");
        let styles = getComputedStyle(document.documentElement);

        for (let key of Object.keys(darkMode)) {
            if (styles.getPropertyValue(key)) {
                root.style.setProperty(key, darkMode[key]);
            }
        }
        chrome.storage.local.set({ theme: "dark" });
        changeScrollbarColor("#141414", "#555555");
    } else {
        let root = document.querySelector(":root");
        let styles = getComputedStyle(document.documentElement);

        for (let key of Object.keys(lightMode)) {
            if (styles.getPropertyValue(key)) {
                root.style.setProperty(key, lightMode[key]);
            }
        }
        chrome.storage.local.set({ theme: "light" });
        changeScrollbarColor("#F7F7F7", "#555555");
    }
}

function changeScrollbarColor(track, thumb) {
    document.body.style.scrollbarTrackColor = track;
}

async function setThemeOnOpen() {
    let { theme } = await chrome.storage.local.get("theme");
    if (theme === "dark") {
        toggleTheme(theme);
    }
}

function removeBackgroundTextureNoSearch() {
    document
        .querySelector(":root")
        .style.setProperty("--cib-no-bing-result-texture", "");
}

setTimeout(() => {
    setInterval(removeDisclaimersAtEndNoSearch, 500);
    setInterval(removeDisclaimersAtBeginningNoSearch, 500);
    removeBackgroundTextureNoSearch();
    addThemeToggle();
    setThemeOnOpen();
}, 500);

// const darkModeString =
