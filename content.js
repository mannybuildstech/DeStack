(() => {
  const HOME_PATH_RE = /^\/?$|^\/home(?:\/)?$|^\/home\/.*/i;

  function shouldHideHomePage() {
    const hostname = window.location.hostname || "";
    const pathname = window.location.pathname || "/";

    if (!hostname.endsWith("substack.com")) {
      return false;
    }

    return HOME_PATH_RE.test(pathname);
  }

  function updateBlockingState() {
    const body = document.body;
    if (!body) return;

    if (shouldHideHomePage()) {
      body.classList.add("substack-home-blocker-enabled");
      let banner = document.getElementById("substack-home-blocker-banner");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "substack-home-blocker-banner";
        banner.textContent = "Home feed hidden by blocker";
        document.body.appendChild(banner);
      }
    } else {
      body.classList.remove("substack-home-blocker-enabled");
      const banner = document.getElementById("substack-home-blocker-banner");
      if (banner) {
        banner.remove();
      }
    }
  }

  function patchIntersectionObserver() {
    if (window.__substackHomeBlockerPatched) {
      return;
    }

    const OriginalIntersectionObserver = window.IntersectionObserver;
    if (!OriginalIntersectionObserver) {
      return;
    }

    window.__substackHomeBlockerPatched = true;
    window.IntersectionObserver = class extends OriginalIntersectionObserver {
      constructor(callback, options) {
        super((entries, observer) => {
          if (shouldHideHomePage()) {
            return;
          }
          callback(entries, observer);
        }, options);
      }
    };
  }

  updateBlockingState();
  patchIntersectionObserver();

  const observer = new MutationObserver(() => {
    updateBlockingState();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "src", "href"]
    });
  }

  window.addEventListener("popstate", updateBlockingState);
  window.addEventListener("load", updateBlockingState);
})();
