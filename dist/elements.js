/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ELEMENT_INVARIANTS = Object.freeze({
  "statusNeverColorOnly": true,
  "readingEditorEquivalent": true,
  "editorInternalReferenceNavigation": "prevented",
  "nonInteractiveBadgeTarget": "content-sized",
  "interactiveTargetUsesPlatformMinimum": true,
  "protocolOwner": "backend-contracts",
  "categoryColorNeedsTextLabel": true
});
export const INLINE_ELEMENT_STYLES = Object.freeze({
  "internalReference": {
    "tone": "brand",
    "foreground": "onAccent",
    "surface": "accent",
    "border": "transparent",
    "weight": 600,
    "icon": "content.internal-reference",
    "overflow": "wrap-no-truncate",
    "editorBehavior": "atomic-no-navigation"
  },
  "link": {
    "tone": "brand",
    "foreground": "brandStrong",
    "weight": 600,
    "underlineWidthPx": 1,
    "underlineOffsetEm": 0.18,
    "externalBehavior": "new-tab"
  },
  "mention": {
    "tone": "brand",
    "foreground": "brandStrong",
    "surface": "transparent",
    "weight": 600,
    "prefix": "@",
    "editorBehavior": "atomic"
  },
  "code": {
    "tone": "neutral",
    "foreground": "foreground",
    "surface": "muted",
    "family": "platform-monospace",
    "sizeEm": 0.88,
    "radiusEm": 0.35,
    "paddingBlockEm": 0.12,
    "paddingInlineEm": 0.35
  },
  "dice": {
    "tone": "brand",
    "family": "utility",
    "numbers": "tabular",
    "radiusEm": 0.3,
    "paddingBlockEm": 0.08,
    "paddingInlineEm": 0.3,
    "settled": {
      "foreground": "onAccent",
      "surface": "accent"
    },
    "pending": {
      "foreground": "warning",
      "surface": "warningSoft",
      "display": "?"
    }
  }
});
export const BLOCK_ELEMENT_STYLES = Object.freeze({
  "quote": {
    "foreground": "foreground",
    "surface": "muted",
    "marker": "primary",
    "markerWidthPx": 3,
    "radius": "compact",
    "fontStyle": "normal",
    "paddingBlockEm": 0.75,
    "paddingInlineEm": 1
  },
  "divider": {
    "color": "border",
    "widthPx": 1
  }
});
export const METADATA_ELEMENT_STYLES = Object.freeze({
  "badge": {
    "sizes": [
      "default",
      "compact"
    ],
    "shape": "pill",
    "weight": 700,
    "family": "utility",
    "tones": {
      "neutral": {
        "foreground": "mutedForeground",
        "surface": "muted"
      },
      "brand": {
        "foreground": "onAccent",
        "surface": "accent"
      },
      "success": {
        "foreground": "success",
        "surface": "successSoft"
      },
      "warning": {
        "foreground": "warning",
        "surface": "warningSoft"
      },
      "danger": {
        "foreground": "destructive",
        "surface": "destructiveSoft"
      },
      "info": {
        "foreground": "info",
        "surface": "infoSoft"
      }
    },
    "default": {
      "heightPx": 24,
      "fontSizePx": 12,
      "iconSizePx": 14
    },
    "compact": {
      "heightPx": 20,
      "fontSizePx": 11,
      "iconSizePx": 12
    }
  },
  "topicTag": {
    "tone": "neutral",
    "prefix": "#",
    "foreground": "mutedForeground",
    "surface": "transparent",
    "border": "border",
    "hoverSurface": "muted",
    "weight": 500
  },
  "level": {
    "tone": "brand",
    "format": "Lv.N",
    "foreground": "onAccent",
    "surface": "accent",
    "heightPx": 20,
    "fontSizePx": 11,
    "weight": 700,
    "family": "utility",
    "numbers": "tabular",
    "radius": "compact"
  },
  "unreadCount": {
    "tone": "danger",
    "foreground": "onDestructive",
    "surface": "destructive",
    "heightPx": 16,
    "fontSizePx": 10,
    "weight": 700,
    "family": "utility",
    "numbers": "tabular",
    "maximumDisplay": "99+",
    "zeroBehavior": "hidden"
  },
  "categoryMarker": {
    "colorOwner": "foundation",
    "foreground": "mutedForeground",
    "badgeTone": "neutral",
    "apiColorBehavior": "ignored",
    "neverSoleCue": true
  }
});
export const ELEMENT_WEB_PROFILE = Object.freeze({
  "interactiveMinimumPx": 32,
  "internalReference": {
    "paddingBlockEm": 0.06,
    "paddingInlineEm": 0.38,
    "gapEm": 0.26,
    "radiusEm": 0.4,
    "iconSizeEm": 0.9,
    "hoverStateOpacity": 0.08,
    "pressedStateOpacity": 0.12
  },
  "categoryMarkerWidthPx": 4
});
export const ELEMENT_MOBILE_PROFILE = Object.freeze({
  "interactiveMinimumDp": 48,
  "internalReference": {
    "paddingBlockEm": 0.08,
    "paddingInlineEm": 0.38,
    "gapEm": 0.28,
    "radiusEm": 0.4,
    "iconSizeEm": 0.92,
    "pressedStateOpacity": 0.12
  },
  "categoryMarkerWidthDp": 4
});
