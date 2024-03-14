const removeDisclaimers = () => {
    const traverseShadowDOM = (element) => {
        if (element && element.shadowRoot) {
            const nestedElement = element.shadowRoot.querySelector(
                "cib-message-attributions"
            );

            if (nestedElement) {
                nestedElement.remove();
            } else {
                const childElements = element.shadowRoot.querySelectorAll("*");
                childElements.forEach((child) => {
                    traverseShadowDOM(child);
                });
            }
        }
    };

    const rootElement = document.querySelector("cib-serp");
    traverseShadowDOM(rootElement);
};

const removeDisclaimersAtBeginning = () => {
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
                childElements.forEach((child) => {
                    traverseShadowDOM(child);
                });
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
                let toggle = document.createElement("input");
                toggle.setAttribute("is", "cib-switch");
                toggle.setAttribute("class", "switch");
                toggle.setAttribute("role", "switch");
                toggle.setAttribute("id", "theme-switch");
                toggle.addEventListener("change", (e) => {
                    console.log("clicked on the toggle!");
                    console.log(e);
                });

                toggleDiv.appendChild(toggle);
                nestedElement.appendChild(toggleDiv);
            } else {
                const childElements = element.shadowRoot.querySelectorAll("*");
                childElements.forEach((child) => {
                    traverseShadowDOM(child);
                });
            }
        }
    };

    const rootElement = document.querySelector("cib-serp");
    traverseShadowDOM(rootElement);
};

setTimeout(() => {
    setInterval(removeDisclaimers, 500);
    setInterval(removeDisclaimersAtBeginning, 500);
    addThemeToggle();
}, 500);
