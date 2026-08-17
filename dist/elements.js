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
    "format": "Lv.N",
    "heightPx": 20,
    "fontSizePx": 11,
    "weight": 700,
    "family": "utility",
    "numbers": "tabular",
    "radius": "compact",
    "invalidBehavior": "hidden",
    "futureLevelBehavior": "highest-tier",
    "tiers": [
      {
        "id": "mist",
        "minimum": 1,
        "maximum": 1,
        "foreground": "#6D6775",
        "surface": "#F7F5F8",
        "border": "#E8E3EB"
      },
      {
        "id": "peach",
        "minimum": 2,
        "maximum": 3,
        "foreground": "#765346",
        "surface": "#FBE9E2",
        "border": "#F2CFC3"
      },
      {
        "id": "rose",
        "minimum": 4,
        "maximum": 5,
        "foreground": "#784653",
        "surface": "#F8D9DF",
        "border": "#EEBBC5"
      },
      {
        "id": "coral",
        "minimum": 6,
        "maximum": 7,
        "foreground": "#5F2935",
        "surface": "#EE9AAA",
        "border": "#D96F84"
      },
      {
        "id": "berry",
        "minimum": 8,
        "maximum": 9,
        "foreground": "#FFFFFF",
        "surface": "#922F50",
        "border": "#7B2442"
      }
    ]
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
    "neverSoleCue": true
  }
});
export const IDENTITY_PRESENTATION = Object.freeze({
  "avatarFallback": {
    "missingOrFailed": "first-readable-character",
    "unavailableOrAnonymous": "neutral-user-icon"
  },
  "roleTones": {
    "owner": "brand",
    "staff": "brand",
    "collaborator": "info",
    "player": "neutral",
    "member": "neutral"
  },
  "emailVerification": {
    "publicIdentity": "hidden",
    "accountSecurityEntry": "when-unverified",
    "restrictedActionGuidance": "contextual"
  }
});
export const CONTENT_STATUS_TONES = Object.freeze({
  "pinned": "brand",
  "new": "brand",
  "private": "warning",
  "locked": "warning",
  "archived": "neutral",
  "unavailable": "neutral",
  "blocked": "danger",
  "error": "danger"
});
export const ECONOMY_TONES = Object.freeze({
  "income": "success",
  "expense": "foreground",
  "balance": "foreground",
  "pending": "warning"
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
export function levelTier(level) {
  if (!Number.isInteger(level) || level < 1) return undefined;
  return METADATA_ELEMENT_STYLES.level.tiers.find((tier) => level <= tier.maximum)
    ?? METADATA_ELEMENT_STYLES.level.tiers.at(-1);
}
