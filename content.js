(() => {
  const HOME_PATH_RE = /^\/?$|^\/home(?:\/)?$|^\/home\/.*/i;
  const FEED_SELECTORS = [
    '[data-testid="notes-feed"]',
    '[data-testid="home-feed"]',
    '[data-testid="for-you-feed"]',
    '[data-testid*="feed"]',
    '[role="feed"]',
    '[aria-label*="feed" i]',
    '.feed',
    '.notes-feed',
    '.home-feed',
    '.post-feed',
    '.post-list',
    '.posts'
  ];

  function shouldHideHomePage() {
    const hostname = window.location.hostname || "";
    const pathname = window.location.pathname || "/";

    if (!hostname.endsWith("substack.com")) {
      return false;
    }

    return HOME_PATH_RE.test(pathname);
  }

  function getHomeFeedElements() {
    const selectors = FEED_SELECTORS.join(", ");
    return Array.from(document.querySelectorAll(selectors)).filter((el) => {
      const tag = el.tagName && el.tagName.toLowerCase();
      return tag !== "header" && tag !== "nav" && tag !== "main";
    });
  }

  function hideLoadingIndicators() {
    document.querySelectorAll(
      '[aria-busy="true"], .loading, .loader, [data-loading], .spinner, [role="status"]'
    ).forEach((el) => {
      if (!el.closest("header") && !el.closest("nav")) {
        el.style.display = "none";
      }
    });
  }

  function updateBlockingState() {
    const body = document.body;
    if (!body) return;

    const hidingHome = shouldHideHomePage();

    if (hidingHome) {
      body.classList.add("substack-home-blocker-enabled");
      getHomeFeedElements().forEach((el) => {
        el.style.display = "none";
      });
      hideLoadingIndicators();

      let banner = document.getElementById("substack-home-blocker-banner");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "substack-home-blocker-banner";
        banner.textContent = "Home feed hidden";
        document.body.appendChild(banner);
      }
    } else {
      body.classList.remove("substack-home-blocker-enabled");
      getHomeFeedElements().forEach((el) => {
        el.style.display = "";
      });

      document.querySelectorAll('[aria-busy="true"], .loading, .loader, [data-loading], .spinner, [role="status"]').forEach((el) => {
        el.style.display = "";
      });

      const banner = document.getElementById("substack-home-blocker-banner");
      if (banner) {
        banner.remove();
      }
    }
  }

  function patchNavigation() {
    const refresh = () => setTimeout(updateBlockingState, 0);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      refresh();
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      refresh();
      return result;
    };

    window.addEventListener("popstate", refresh);
    window.addEventListener("hashchange", refresh);
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

  patchNavigation();
  patchIntersectionObserver();
  updateBlockingState();

  const observer = new MutationObserver(() => {
    updateBlockingState();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "src", "href", "style"]
    });
  }

  window.addEventListener("load", updateBlockingState);
})();
