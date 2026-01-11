import React, { useEffect, useMemo, useState } from "react";

import SwordIcon from "./icons/sword.svg";
import StaffIcon from "./icons/staff.svg";
import BowIcon from "./icons/bow.svg";
import JavelinIcon from "./icons/javelin.svg";
import SpearIcon from "./icons/spear.svg";
import AxeIcon from "./icons/axe.svg";
import MaceIcon from "./icons/mace.svg";
import KnifeIcon from "./icons/knife.svg";
import CrossbowIcon from "./icons/crossbow.svg";
import ClawsIcon from "./icons/claws.svg";
import PolearmIcon from "./icons/polearm.svg";
import ScepterIcon from "./icons/scepter.svg";
import WandIcon from "./icons/wand.svg";
import ThrowingAxeIcon from "./icons/throwing-axe.svg";
import ThrowingKnifeIcon from "./icons/throwing-knife.svg";
import SorceressOrbIcon from "./icons/orb.svg";
import HammerIcon from "./icons/hammer.svg";
import ScytheIcon from "./icons/scythe.svg";
import HelmetIcon from "./icons/helmet.svg";
import BodyArmorIcon from "./icons/armor.svg";
import ShieldIcon from "./icons/shield.svg";
import BootsIcon from "./icons/boots.svg";
import GlovesIcon from "./icons/gloves.svg";
import BeltIcon from "./icons/belt.svg";
import RingIcon from "./icons/ring.svg";
import AmuletIcon from "./icons/amulet.svg";
import QuiverIcon from "./icons/quiver.svg";
import JewelIcon from "./icons/jewel.svg";
import MapIcon from "./icons/map.svg";
import MythicJewelIcon from "./icons/mythic.svg";
import OrnateCharmIcon from "./icons/cm4.svg";
import RuneIcon from "./icons/rune.svg";
import SacredIcon from "./icons/sacred.svg";

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const TABS = {
  weapons: "Weapons",
  armors: "Armors",
  uniques: "Uniques",
  runewords: "Runewords",
  sacreds: "Sacreds",
  cube: "Cube Recipes",
  changes: "SoE changes",
  help: "Help",
};

const PROP_HIGHLIGHT_RULES = [
  { test: /corrupted/i, className: "propRed" },
];

const TAB_KEYS = ["weapons", "armors", "uniques", "runewords", "sacreds", "cube", "changes", "help"];

const WEAPON_ICON_MAP = {
  sword: SwordIcon,
  staff: StaffIcon,
  bow: BowIcon,
  javelin: JavelinIcon,
  spear: SpearIcon,
  axe: AxeIcon,
  mace: MaceIcon,
  knife: KnifeIcon,
  crossbow: CrossbowIcon,
  claws: ClawsIcon,
  polearm: PolearmIcon,
  scepter: ScepterIcon,
  wand: WandIcon,
  throwingAxe: ThrowingAxeIcon,
  throwingKnife: ThrowingKnifeIcon,
  orb: SorceressOrbIcon,
  hammer: HammerIcon,
  scythe: ScytheIcon,
  quiver: QuiverIcon
};

const ARMOR_ICON_MAP = {
  helm: HelmetIcon,
  pahm: HelmetIcon,
  phlm: HelmetIcon,
  pelt: HelmetIcon,
  circ: HelmetIcon,
  tors: BodyArmorIcon,
  shie: ShieldIcon,
  boot: BootsIcon,
  glov: GlovesIcon,
  belt: BeltIcon,
  bels: BeltIcon,
  ashd: ShieldIcon,
  head: ShieldIcon
};

const JEWELRY_ICON_MAP = {
  rin: RingIcon,
  amu: AmuletIcon,
  ram: AmuletIcon,
  aqv: QuiverIcon,
  aqv2: QuiverIcon,
  aqv3: QuiverIcon,
  cqv: QuiverIcon,
  cqv2: QuiverIcon,
  cqv3: QuiverIcon,
  jew: JewelIcon,
  t51: MapIcon,
  t52: MapIcon,
  t53: MapIcon,
  t54: MapIcon,
  t55: MapIcon,
  t56: MapIcon,
  mjw: MythicJewelIcon,
  cm4: OrnateCharmIcon,
  cm2: OrnateCharmIcon,
  cm3: OrnateCharmIcon,
  cm1: OrnateCharmIcon,
};

const MOD_EXPANSIONS = [
  {
    whenIncludes: "all resistances",
    implies: [
      "fire resistance",
      "cold resistance",
      "lightning resistance",
      "poison resistance",
    ],
  },

  {
    whenIncludes: "all attributes",
    implies: ["strength", "dexterity", "vitality", "energy"],
  } 
];

const ARMOR_TYPE_MAP = {
  helm: "Helm",
  tors: "Armor",
  shie: "Shield",
  glov: "Gloves",
  boot: "Boots",
  belt: "Belt",
  bels: "Belt",
  pelt: "Druid Pelt",
  phlm: "Barbarian Helm",
  ashd: "Paladin Shield",
  head: "Necromancer Head",
  circ: "Circlet",
  pahm: "Paladin Helmet"
};

const TOOLTIPS_TEXT_MAP = {
  "qualityLevel": "Quality level is a stat that determines to which treasure class the item belongs. It's important for gambling (higher quality level means lower chance to upgrade the item tier) and unique item drop generation, as items with higher quality level tend to drop less.",
  "runes": "Runes here are shown in the exact order you should put them in your item to create a runeword.",
  "occurrenceChance": "Occurrence chance is chance for this item to drop when the game rolls an unique item on base and base has more than one unique item attached to it.",
  "dropRate": "Drop rate is chance for this item to drop from specific monster, most likely from Uber Boss.",
  "code": "This code can be used in your loot filter to highlight this specific base.",
  "uniCode": "This code can be used in your loot filter to highlight this specific base - remember to add UNI modifier.",
  "sacred": "Additionaly to items mentioned here it is required to use Sacred Orb in the Cube.",
  "mythicDivineOrb": "In Sanctuary of Exile unique items can be created in the Cube by using base and an currency orb appropiate for item tier - Mythic Orb for normal and exceptional bases and Divine Orb for elite bases."
};

  const INFO_BY_TAB = {
  sacreds: {
    title: "About Sacred Items",
    text:
      "Sacred items system is exclusive to Sanctuary of Exile. It allows to harness the power of a runeword and imprint it to `Unique` or `Crafted` item:\n\n" +
      "- Making an item sacred requires finding `Sacred Orb` which drops in `T4 Dungeons` or from monsters added by `Terror of Opulence`\n\n" +
      "- To sacred an item, first use `Sacred Orb` with `Runes` (or additional items - consult appropriate recipe in the list below) used to create a runeword to create `Sacred Orb of X`\n\n"  + 
      "- Runes have to be in stacked form, each with the quantity presented in the Sacred tooltip on this page\n\n" +
      "- Use the created orb with `Unique` or `Crafted` item you wish to make sacred. Please note that added modifiers may vary by item type\n\n" +
      "- Sacred items can be corrupted with `World Stone Shard`\n\n" +
      "- Sacred modifiers along with sacred status can be removed from `Unique` items by using `Demonic Cube` as long as it's **not** `Corrupted`\n\n" +
      "- Sacred modifiers along with sacred status **CANNOT** be removed from `Crafted` items, so choose wisely!\n\n" +
      "- The additional equipment component mentioned in the recipe can be of any quality and tier"
  },
};

function getTitleByTab(tab) {
  return TABS[tab];
}

function sacredTypes(it) {
  const a = Array.isArray(it?.itemTypesDisplayNames) ? it.itemTypesDisplayNames : [];
  return a.map((x) => n(x)).filter(Boolean);
}

function sacredIngredients(it) {
  const out = [];

  repeatIngredient(it?.firstInputDisplayName,  it?.firstInputQuantity).forEach(v => out.push(v));
  repeatIngredient(it?.secondInputDisplayName, it?.secondInputQuantity).forEach(v => out.push(v));
  repeatIngredient(it?.thirdInputDisplayName,  it?.thirdInputQuantity).forEach(v => out.push(v));
  repeatIngredient(it?.fourthInputDisplayName, it?.fourthInputQuantity).forEach(v => out.push(v));
  repeatIngredient(it?.fifthInputDisplayName,  it?.fifthInputQuantity).forEach(v => out.push(v));
  repeatIngredient(it?.sixthInputDisplayName,  it?.sixthInputQuantity).forEach(v => out.push(v));

  return out;
}

// ---- tiny helpers ----
const n = (v) => (v === null || v === undefined ? "" : String(v).trim());
const has = (v) => n(v) !== "";
const nz = (v) => has(v) && n(v) !== "0";
const fmtSigned = (v) => {
  if (!has(v)) return "";
  const x = Number(v);
  if (Number.isNaN(x)) return String(v);
  return (x > 0 ? "+" : "") + x;
};

function repeatIngredient(name, qtyRaw) {
  const nameStr = n(name);
  if (!nameStr) return [];

  const qty = Number(qtyRaw);
  // quantity 0 or invalid → show once (for things like "Armor", "Any Shield")
  if (!Number.isFinite(qty) || qty <= 1) {
    return [nameStr];
  }

  return Array.from({ length: qty }, () => nameStr);
}

function isHighlightedItem(u) {
  return u?.highlight;
}

function isUberUnique(u) {
  const src = u?.dropSource;
  return src !== null && src !== undefined && String(src).trim() !== "";
}

function getItemIconUrl(tab, item) {
  if (tab === "weapons") {
    const key = weaponIconKeyForItem(item);
    return key ? WEAPON_ICON_MAP[key] : null;
  }

  if (tab === "armors") {
    const key = armorIconKeyForItem(item);
    return key ? ARMOR_ICON_MAP[key] : null;
  }

  if (tab === "uniques") {
    return getUniqueBaseIconUrl(item);
  }

  if (tab === "runewords") {
    return RuneIcon;
  }

  if (tab === "sacreds") {
    return SacredIcon;
  }

  return null;
}

function getUniqueBaseIconUrl(u) {
  if (u?.jeweleryBase?.code) {
    const code = String(u.jeweleryBase.code).toLowerCase();
    if (JEWELRY_ICON_MAP[code]) {
      return JEWELRY_ICON_MAP[code];
    }
  }

  if (u?.armorBase) {
    const armorBase = u.armorBase;
    const key = armorIconKeyForItem(armorBase);
    if (key) {
      return ARMOR_ICON_MAP[key];
    }

    if (armorBase.itemType?.code) {
      const typeCode = String(armorBase.itemType.code).toLowerCase();
    }
  }

  if (u?.weaponBase) {
    const weaponBase = u.weaponBase;
    const key = weaponIconKeyForItem(weaponBase);
    if (key) {
      return WEAPON_ICON_MAP[key];
    }
  }

  return null;
}

function armorIconKeyForItem(a) {
  const t =
    n(a?.itemType?.code) ||
    n(a?.displayType) ||
    ARMOR_TYPE_MAP[n(a?.type)] ||
    n(a?.type);

  return t.toLowerCase();
}

function weaponIconKeyForItem(it) {
  const type = n(it?.itemType?.itemType || it?.itemType).toLowerCase();

  if (type.includes("scythe")) return "scythe";
  if (type.includes("hammer")) return "hammer";
  if (type.includes("orb")) return "orb";
  if (type.includes("throwing knife")) return "throwingKnife";
  if (type.includes("throwing axe")) return "throwingAxe";
  if (type.includes("sword")) return "sword";
  if (type.includes("staff")) return "staff";
  if (type.includes("bow")) return "bow";
  if (type.includes("javelin")) return "javelin";
  if (type.includes("spear")) return "spear";
  if (type.includes("axe")) return "axe";
  if (type.includes("club") || type.includes("mace") || type.includes("hammer")) return "mace";
  if (type.includes("knife")) return "knife";
  if (type.includes("crossbow")) return "crossbow";
  if (type.includes("claws")) return "claws";
  if (type.includes("scythe") || type.includes("polearm")) return "polearm";
  if (type.includes("scepter")) return "scepter";
  if (type.includes("wand")) return "wand";

  return null;
}

function sacredPropertiesText(s) {
  const map =
    s?.propertiesByItemType && typeof s.propertiesByItemType === "object"
      ? s.propertiesByItemType
      : {};

  const lines = [];
  for (const key of Object.keys(map)) {
    const arr = Array.isArray(map[key]) ? map[key] : [];
    for (const v of arr) {
      if (v != null && String(v).trim() !== "") lines.push(String(v));
    }
  }
  return lines.join("\n");
}


function renderInlineMarkdown(text, onLink) {
  const s = String(text ?? "");

  const parts = s.split(/(`[^`]*`)/g);

  // helper: split a plain string into text + link pieces
  function renderWithLinks(str, keyPrefix) {
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
    const out = [];
    let last = 0;
    let m;
    let idx = 0;

    while ((m = linkRe.exec(str)) !== null) {
      if (m.index > last) {
        out.push(
          <React.Fragment key={`${keyPrefix}-t-${idx}`}>
            {str.slice(last, m.index)}
          </React.Fragment>
        );
      }

      const label = m[1];
      const href = m[2];

      if (href.startsWith("app:") && typeof onLink === "function") {
        const payload = href.slice(4); // remove "app:"
        const [tabRaw, ...rest] = payload.split(":");
        const tab = (tabRaw || "").toLowerCase();
        const name = decodeURIComponent(rest.join(":")).trim();

        out.push(
          <button
            key={`${keyPrefix}-app-${idx}`}
            type="button"
            className="mdLink mdLinkInternal"
            onClick={() => onLink({ tab, name })}
          >
            {label}
          </button>
        );
      } else {
        out.push(
          <a
            key={`${keyPrefix}-ext-${idx}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mdLink"
          >
            {label}
          </a>
        );
      }

      last = linkRe.lastIndex;
      idx += 1;
    }

    if (last < str.length) {
      out.push(
        <React.Fragment key={`${keyPrefix}-tail`}>
          {str.slice(last)}
        </React.Fragment>
      );
    }

    return out;
  }

  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="mdCode">
          {part.slice(1, -1)}
        </code>
      );
    }

    const boldSplit = part.split(/(\*\*[^*]+\*\*)/g);
    return boldSplit.map((b, j) => {
      if (b.startsWith("**") && b.endsWith("**")) {
        return (
          <strong key={`${idx}-${j}`} className="mdStrong">
            {b.slice(2, -2)}
          </strong>
        );
      }

      const italicSplit = b.split(/(\*[^*]+\*)/g);
      return italicSplit.map((it, k) => {
        if (it.startsWith("*") && it.endsWith("*")) {
          return (
            <em key={`${idx}-${j}-${k}`} className="mdEm">
              {it.slice(1, -1)}
            </em>
          );
        }

        // this is the plain text segment: run link parsing here
        return (
          <React.Fragment key={`${idx}-${j}-${k}`}>
            {renderWithLinks(it, `${idx}-${j}-${k}`)}
          </React.Fragment>
        );
      });
    });
  });
}

function Markdown({ text, onLink }) {
  const src = Array.isArray(text) ? text.join("\n") : text;
  const raw = String(src ?? "").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");

  const blocks = [];
  let buf = [];

  const flushParagraph = () => {
    if (!buf.length) return;
    const joined = buf.join(" ").trim();
    if (joined) blocks.push({ type: "p", text: joined });
    buf = [];
  };

  // listBuf now stores objects: { text, children: [] }
  let listBuf = [];
  const flushList = () => {
    if (!listBuf.length) return;
    blocks.push({ type: "ul", items: listBuf });
    listBuf = [];
  };

  for (const line of lines) {
    const t = line.trimEnd();

    if (!t.trim()) {
      flushList();
      flushParagraph();
      continue;
    }

      // capture indent + bullet
    const bullet = t.match(/^(\s*)[-*]\s+(.+)$/);
    if (bullet) {
      const indent = bullet[1].length; // number of leading spaces
      const content = bullet[2].trim();

      flushParagraph();

      // top-level bullet: no indent
      if (indent === 0) {
        listBuf.push({ text: content, children: [] });
      } else {
        // second-level bullet: attach to last top-level item
        const parent = listBuf[listBuf.length - 1];
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(content);
        } else {
          // if somehow no parent exists, fall back to top-level
          listBuf.push({ text: content, children: [] });
        }
      }
      continue;
    }

    flushList();
    buf.push(t.trim());
  }

  flushList();
  flushParagraph();

  return (
    <div className="md">
      {blocks.map((b, i) => {
        if (b.type === "ul") {
          return (
            <ul key={i} className="mdUl">
              {b.items.map((item, j) => (
                <li key={j} className="mdLi">
                  {renderInlineMarkdown(item.text, onLink)}
                  {item.children && item.children.length > 0 && (
                    <ul className="mdUl mdUlNested">
                      {item.children.map((child, k) => (
                        <li key={k} className="mdLi mdLiNested">
                          {renderInlineMarkdown(child, onLink)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mdP">
            {renderInlineMarkdown(b.text, onLink)}
          </p>
        );
      })}
    </div>
  );
}



function classForPropertyLine(line) {
  const s = String(line || "");
  for (const rule of PROP_HIGHLIGHT_RULES) {
    if (rule?.test?.test(s)) return rule.className;
  }
  return "";
}

function parseSearchQuery(input) {
  const text = input.trim().toLowerCase();
  if (!text) return { phrases: [], terms: [] };

  const phrases = [];
  const phraseRegex = /"([^"]+)"/g;

  let rest = text;
  let m;

  while ((m = phraseRegex.exec(text)) !== null) {
    phrases.push(m[1]);
    rest = rest.replace(m[0], " ");
  }

  const terms = rest
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return { phrases, terms };
}

function isDontDisplay(it) {
  const v = it ? it.dontDisplay : false;
  return (
    v === true ||
    v === 1 ||
    v === "1" ||
    (typeof v === "string" && v.toLowerCase() === "true")
  );
}

function Tip({ text, children }) {
  if (!text) return children;

  const parts = String(text).split("\n");

  return (
    <span className="tipWrap">
      {children}
      <span className="tipBubble" role="tooltip">
        {parts.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < parts.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}

function buildSearchTextForItem(tab, it) {
  const name = (n(it?.displayName) || n(it?.runewordName) || n(it?.name)).toLowerCase();

  if (tab === "uniques" || tab === "runewords") {
    const props = Array.isArray(it?.displayProperties) ? it.displayProperties : [];
    const propsText = props
      .filter((x) => x != null)
      .map((x) => String(x).toLowerCase())
      .join("\n");

    return applyModifierExpansions(`${name}\n${propsText}`);
  }

  if (tab === "sacreds") {
    const ing = sacredIngredients(it).join("\n").toLowerCase();
    const props = sacredPropertiesText(it).toLowerCase();
    return `${name}\n${ing}\n${props}`;
  }

  return name;
}

function applyModifierExpansions(searchText) {
  let out = searchText;

  for (const rule of MOD_EXPANSIONS) {
    if (!rule?.whenIncludes || !Array.isArray(rule?.implies)) continue;

    if (out.includes(rule.whenIncludes.toLowerCase())) {
      out += "\n" + rule.implies.map((s) => s.toLowerCase()).join("\n");
    }
  }

  return out;
}

function runewordAllTypes(rw) {
  const a = Array.isArray(rw?.displayItemTypes) ? rw.displayItemTypes : [];
  const b = Array.isArray(rw?.itemTypes) ? rw.itemTypes : [];
  return (a.length ? a : b).map((x) => n(x)).filter(Boolean);
}

function filterVisible(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((it) => !isDontDisplay(it));
}

function weaponTypeLabel(w) {
  const primary = n(w?.itemType?.displayName) || n(w?.displayType) || n(w?.type);
  const secondary =
    n(w?.secondItemType?.displayName) || n(w?.secondDisplayType) || n(w?.secondType);
  return has(secondary) ? `${primary} / ${secondary}` : primary || "weapon";
}

function weaponTypeForFilter(w) {
  return n(w?.itemType?.itemType) || n(w?.type);
}

function armorTypeLabel(a) {
  const dt = n(a?.displayType);
  const sdt = n(a?.secondDisplayType);
  const base = dt || ARMOR_TYPE_MAP[n(a?.type)] || n(a?.type) || "armor";
  const sec = has(sdt) ? sdt : "";
  return has(sec) ? `${base} / ${sec}` : base;
}

function armorTypeForFilter(a) {
  return n(a?.displayType) || ARMOR_TYPE_MAP[n(a?.type)] || n(a?.type);
}

function uniqueBase(u) {
  return u?.weaponBase ?? u?.armorBase ?? u?.jeweleryBase ?? null;
}

function uniqueBaseTypeLabel(u) {
  const base = uniqueBase(u);
  return n(base?.itemType?.itemType) || n(base?.displayName) || n(base?.type);
}

function uniqueBaseTypeLabelPretty(u) {
  const base = uniqueBase(u);
  return n(base?.itemType?.displayName) || n(base?.displayName) || n(base?.displayType) || uniqueBaseTypeLabel(u);
}

function weaponDmgLines(w) {
  const out = [];
  const min = n(w?.minDamage),
    max = n(w?.maxDamage);
  const tmin = n(w?.twoHandedMinDamage),
    tmax = n(w?.twoHandedMaxDamage);
  const mmin = n(w?.minMissileDamage),
    mmax = n(w?.maxMissileDamage);

  if (has(min) && has(max)) out.push({ k: "One-Hand Damage", v: `${min} to ${max}` });
  if (has(tmin) && has(tmax)) out.push({ k: "Two-Hand Damage", v: `${tmin} to ${tmax}` });
  if (has(mmin) && has(mmax)) out.push({ k: "Throw Damage", v: `${mmin} to ${mmax}` });
  return out;
}

function armorDefenseLine(a) {
  const minD = n(a?.minDefense),
    maxD = n(a?.maxDefense);
  if (has(minD) && has(maxD)) return `${minD} to ${maxD}`;
  if (has(minD)) return `${minD}`;
  return "";
}

function useJson(fileName) {
  const [state, setState] = React.useState({
    loading: true,
    data: [],
    error: null,
  });

  React.useEffect(() => {
    let cancelled = false;

    const url = `${import.meta.env.BASE_URL}data/${fileName}`;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(url, { cache: "no-store" }) // <-- prevents 304 responses
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status} ${r.statusText}`);
        }
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        const arr = Array.isArray(json) ? json : [];
        setState({ loading: false, data: filterVisible(arr), error: null });
      })
      .catch((e) => {
        if (cancelled) return;
        const err = e instanceof Error ? e : new Error(String(e));
        setState({ loading: false, data: [], error: err });
      });

    return () => {
      cancelled = true;
    };
  }, [fileName]);

  return state;
}

function lineKV(k, v, extraClass = "", tooltipText = "") {
  var showTooltip = tooltipText !== null && tooltipText !== "";
  return (
    <div className={("line kv " + (extraClass || "")).trim()}>
      {showTooltip ? <Tip text={String(tooltipText)}><span>{k}</span></Tip> : <span>{k}</span>}
      <span>{String(v)}</span>
    </div>
  );
}

function getItemTypeForUnique(u) {
  if(has(u?.weaponBase)) {
    return "WEAPON";
  }

  if(has(u?.armorBase)) {
    return "ARMOR";
  }

  if(has(u?.jeweleryBase)) {
    return "JEWELERY";
  }
}

function getRequiredLevelForUnique(u, itemType) {
  if(u?.requiredLevel > 0) {
    return u?.requiredLevel;
  }

  if(itemType === "WEAPON") {
    return u?.weaponBase?.requiredLevel;
  }

  if(itemType === "ARMOR") {
    return u?.armorBase?.requiredLevel;
  }

  if(itemType === "JEWELERY") {
    return u?.jeweleryBase?.requiredLevel;
  }
}

function getRequiredStrengthForUnique(u, itemType) {
  if(itemType === "WEAPON") {
    return u?.weaponBase?.requiredStrength;
  }

  if(itemType === "ARMOR") {
    return u?.armorBase?.requiredStrength;
  }
}

function getRequiredDexterityForUnique(u) {
  return u?.weaponBase?.requiredDexterity;
}

function FiltersBar({
  search,
  setSearch,
  typeValue,
  setTypeValue,
  tierValue,
  setTierValue,
  socketsValue,
  setSocketsValue,
  uberValue,
  setUberValue,
  types,
  tiers,
  showSockets,
  showUber,
  typePlaceholder,
  searchInputRef,
  showTier,
  highlightOnly,
  setHighlightOnly,
  showHighlight,
}) {
  return (
    <div className="filtersRow">
      <div className="filtersPanel">
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          className="searchBar"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item name…"
        />

        <select
          value={typeValue}
          onChange={(e) => setTypeValue(e.target.value)}
          style={{ maxWidth: 260 }}
        >
          <option value="">{typePlaceholder}</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {showSockets && (
          <select
            value={socketsValue}
            onChange={(e) => setSocketsValue(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">All sockets</option>
            {Array.from({ length: 7 }, (_, i) => String(i)).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        {showTier && (
          <select
            value={tierValue}
            onChange={(e) => setTierValue(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">All tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        {showUber && (
          <label className="toggleWrap" title="Show only Uber Boss uniques">
            <span className="toggleText">Show Uber Boss uniques</span>
            <div className="toggle">
              <input
                type="checkbox"
                checked={uberValue}
                onChange={(e) => setUberValue(e.target.checked)}
              />
              <span className="toggleSlider" />
            </div>
          </label>
        )}

        {showHighlight && (
          <label className="toggleWrap" title="Show only highlighted uniques">
            <span className="toggleText">Show added in SoE</span>
            <div className="toggle">
              <input
                type="checkbox"
                checked={highlightOnly}
                onChange={(e) => setHighlightOnly(e.target.checked)}
              />
              <span className="toggleSlider" />
            </div>
          </label>
        )}
        </div>

        <div className="filtersResetPanel">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearch("");
              setTypeValue("");
              setTierValue("");
              setSocketsValue("");
              setUberValue("");
              setHighlightOnly(false);  
            }}
          >
            Reset
          </button>
      </div>
    </div>
  );
}

function InfoPanel({ title, markdownText, isOpen, onToggle, onLink }) {
  if (!markdownText) return null;

  return (
    <div className="infoPanel">
      <div className="infoHeader">
        <div className="infoTitle">{title}</div>

        <button type="button" className="infoToggle" onClick={onToggle}>
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen ? (
        <div className="infoBody">
          <Markdown text={markdownText} onLink={onLink} />
        </div>
      ) : null}
    </div>
  );
}

function ListPanel({ title, countLabel, items, activeIndex, setActiveIndex, subLabel, tinyLabel, tab }) {
  const activeRowRef = React.useRef(null);

  React.useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div className="listPanel">
      <div className="listHeader">
        <div className="title">{title}</div>
        <div className="count">{countLabel}</div>
      </div>

      <div className="list" role="list">
        {items.length === 0 ? (
          <div className="emptyState">No items match your filters.</div>
        ) : (
          items.map((it, i) => {
            const iconUrl = getItemIconUrl(tab, it);

            return (
              <div
                key={`${i}::${n(it?.code)}::${n(it?.displayName) || n(it?.name)}`}
                ref={i === activeIndex ? activeRowRef : null}
                className={"row" + (i === activeIndex ? " active" : "")}
                onClick={() => setActiveIndex(i)}
                role="listitem"
              >
                <div className="ico">
                  {iconUrl ? (
                    <img src={iconUrl} className="icon" alt="" />
                  ) : null}
                </div>
                <div className="meta">
                  <div className="name">
                    {n(it?.displayName) || n(it?.name) || "Unknown"}
                  </div>
                  <div className="sub">{subLabel(it)}</div>
                  <div className="tiny">{tinyLabel(it)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


function TooltipShell({ children }) {
  return (
    <div className="tooltipShell">
      <div className="tooltip">{children}</div>
    </div>
  );
}

function TierLinks({ entries, onGo }) {
  const usable = entries.filter((e) => has(e.name) && has(e.code));
  if (!usable.length) return null;

  return (
    <>
      {usable.map((e) => (
        <div key={e.tierLabel + "|" + e.code} className="line kv dim">
          <span>{e.tierLabel} Tier Item:</span>
          <span>
            <a
              className="d2link"
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                onGo(e.code);
              }}
            >
              {e.name}
            </a>
          </span>
</div>
      ))}
    </>
  );
}

function UniquesPanel({ uniques, onGoUnique }) {
  const list = Array.isArray(uniques) ? uniques : [];
  if (!list.length) return null;

  return (
    <>
      <div className="hr" />
      <div className="uniqueHeader">Uniques</div>

      {list.map((u, idx) => {
        const name = n(u?.uniqueName);
        const code = n(u?.uniqueCode);
        if (!name) return null;

        return (
          <div key={`${idx}::${name}::${code}`} className="line goToLink">
            {code ? (
              <a
                className="d2link"
                href="#"
                onClick={(ev) => {
                  ev.preventDefault();
                  onGoUnique(code);
                }}
                title={`Go to unique: ${code}`}
              >
                {name}
              </a>
            ) : (
              <span className="d2linkText">{name}</span>
            )}
          </div>
        );
      })}
    </>
  );
}

function SacredTooltip({ s }) {
  if (!s) return <div className="emptyState">Select an item.</div>;

  const title = n(s?.displayName) || "Sacred";
  const types = sacredTypes(s);
  const ing = sacredIngredients(s);

  const map = s?.propertiesByItemType && typeof s.propertiesByItemType === "object"
    ? s.propertiesByItemType
    : {};

  const typeKeys = Object.keys(map);

  return (
    <>
      <div className="tipTitle">{title}</div>

      {types.length ? (
        <div className="tipSubtitle">
          <span className="dim"></span>
          {types.join(" / ")}
        </div>
      ) : null}

      <div className="hr" />

      {ing.length ? <div className="line dim runesDisplay"><Tip text={String(TOOLTIPS_TEXT_MAP["sacred"])}>{ing.join(" · ")}</Tip></div> : <div className="line dim">No runes listed.</div>}

      <div className="hr" />

      <div className="sacredModsHeader">Mods by item type</div>
      {typeKeys.length ? (
        typeKeys.map((k) => {
          const arr = Array.isArray(map[k]) ? map[k] : [];
          if (!arr.length) return null;

          return (
            <div key={k} style={{ marginBottom: 10 }}>
              <div className="sacredModsItemType">{k}</div>
              {arr.map((p, i) => {
                const raw = String(p);
                const normalized = raw.replace(/\\n/g, "\n");
                const parts = normalized.split("\n");

                return (
                  <div key={`${k}-${i}`} className="runeModLine">
                    {parts.map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < parts.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <div className="line dim">No properties listed.</div>
      )}
    </>
  );
}

function HelpPanel() {
  return (
    <div className="helpPanel">
      <div className="helpTitle">Help</div>

      <div className="helpBody">
        <p><b>Navigation</b></p>
        <ul>
          <li><b>← / →</b> switch tabs</li>
          <li><b>↑ / ↓</b> move selection in the item  list</li>
          <li><b>Ctrl/Cmd + F</b> hotkey - focus search</li>
          <li><b>Esc</b> unfocus search (when focused on it)</li>
        </ul>

        <p><b>Search</b></p>
        <ul>
          <li>Use quotes for exact phrases: <code>"faster cast rate"</code></li>
          <li>In <b>Uniques</b>, <b>Runewords</b> and <b>Sacreds</b> tabs, search also checks modifiers.</li>
        </ul>

        <p><b>UI</b></p>
        <ul>
          <li>Dotted underline under label means that it contains useful hint on hover.</li>
          <li>Dashed underline under label means that it links to an entry on this site and will transfer to it on click.</li>
        </ul>
      </div>
    </div>
  );
}

function WeaponTooltip({ w, onGoCode, onGoUnique }) {
  if (!w) return <div className="emptyState">Select an item.</div>;
  const title = n(w?.displayName) || n(w?.name) || "Unknown Item";
  const hasRequirements = (has(w?.requiredStrength) || has(w?.requiredDexterity) || has(w?.requiredLevel) && w?.requiredLevel != 0 && w?.requiredDexterity != 0 && w?.requiredStrength != 0);

  const tierEntries = [
    {
      tierLabel: "Normal",
      name: n(w?.normalItemDisplayName),
      code: n(w?.normalTierCode),
    },
    {
      tierLabel: "Exceptional",
      name: n(w?.exceptionalItemDisplayName),
      code: n(w?.exceptionalTierCode),
    },
    {
      tierLabel: "Elite",
      name: n(w?.eliteItemDisplayName),
      code: n(w?.eliteTierCode),
    },
  ];

  return (
    <>
      <div className="tipTitle">{title}</div>
      <div className="tipSubtitle">{weaponTypeLabel(w)}</div>
      <div className="hr" />

      {weaponDmgLines(w).map((d) => (
        <React.Fragment key={d.k}>{lineKV(d.k + ":", d.v)}</React.Fragment>
      ))}

      {has(w?.speed) && lineKV("Weapon Speed Modifier:", fmtSigned(w?.speed) || n(w?.speed))}

      {n(w?.noDurability) === "1" ? (
        <div className="line dim">Indestructible</div>
      ) : (
        has(w?.durability) && lineKV("Durability:", n(w?.durability))
      )}

      {has(w?.maxSockets) && lineKV("Maximum Sockets:", n(w?.maxSockets))}

      {hasRequirements ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Requirements</div>
          {nz(w?.requiredLevel) && lineKV("Required Level:", n(w?.requiredLevel), "req")}
          {(nz(w?.requiredStrength) || nz(w?.requiredDexterity))}
          {nz(w?.requiredStrength) && lineKV("Required Strength:", n(w?.requiredStrength), "req")}
          {nz(w?.requiredDexterity) && lineKV("Required Dexterity:", n(w?.requiredDexterity), "req")}
        </>
      ) : null}

      <div className="hr" />
      <div className="dropHeader">Additional item information</div>
      {has(w?.itemTier) && lineKV("Item Tier:", n(w?.itemTier), "dim")}
      {has(w?.level) && lineKV("Quality Level:", n(w?.level), "", TOOLTIPS_TEXT_MAP["qualityLevel"])}
      {lineKV("Code:", n(w?.code), "dim", TOOLTIPS_TEXT_MAP["code"])}
      <TierLinks entries={tierEntries} onGo={onGoCode} />
      <UniquesPanel uniques={w?.uniques} onGoUnique={onGoUnique} />
    </>
  );
}

function ArmorTooltip({ a, onGoCode, onGoUnique }) {
  if (!a) return <div className="emptyState">Select an item.</div>;
  const title = n(a?.displayName) || n(a?.name) || "Unknown Item";
  const def = armorDefenseLine(a);
  const hasRequirements = (has(a?.requiredStrength) && a?.requiredStrength > 0 && has(a?.requiredLevel) && a?.requiredLevel > 0) || (has(a?.requiredStrength) && a?.requiredStrength > 0);

  const tierEntries = [
    {
      tierLabel: "Normal",
      name: n(a?.normalItemDisplayName),
      code: n(a?.normalTierCode),
    },
    {
      tierLabel: "Exceptional",
      name: n(a?.exceptionalItemDisplayName),
      code: n(a?.exceptionalTierCode),
    },
    {
      tierLabel: "Elite",
      name: n(a?.eliteItemDisplayName),
      code: n(a?.eliteTierCode),
    },
  ];

  return (
    <>
      <div className="tipTitle">{title}</div>
      <div className="tipSubtitle">{armorTypeLabel(a)}</div>
      <div className="hr" />

      {has(def) && lineKV("Defense:", def)}
      {nz(a?.block) && lineKV("Chance to Block:", `${n(a?.block)}%`)}
      {nz(a?.maxSockets) && lineKV("Maximum Sockets:", n(a?.maxSockets))}
      {has(a?.durability) && lineKV("Durability:", n(a?.durability))}

      {hasRequirements ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Requirements</div>
            {nz(a?.requiredLevel) && lineKV("Required Level:", n(a?.requiredLevel), "req")}
            {nz(a?.requiredStrength) && lineKV("Required Strength:", n(a?.requiredStrength), "req")}
        </>
      ) : null}

      <div className="hr" />
      <div className="dropHeader">Additional item information</div>
      {has(a?.itemTier) && lineKV("Item Tier:", n(a?.itemTier), "dim")}
      {has(a?.level) && lineKV("Quality Level:", n(a?.level), "", TOOLTIPS_TEXT_MAP["qualityLevel"])}
      {lineKV("Code:", n(a?.code), "dim", TOOLTIPS_TEXT_MAP["code"])}
      <TierLinks label="Tiers:" entries={tierEntries} onGo={onGoCode} />
      <UniquesPanel uniques={a?.uniques} onGoUnique={onGoUnique} />
    </>
  );
}

function RunewordTooltip({ rw, onGoSacred }) {
  if (!rw) return <div className="emptyState">Select an item.</div>;

  const title = n(rw?.displayName) || n(rw?.runewordName) || "Runeword";

  const runes = [
    n(rw?.firstRuneDisplayName),
    n(rw?.secondRuneDisplayName),
    n(rw?.thirdRuneDisplayName),
    n(rw?.fourthRuneDisplayName),
    n(rw?.fifthRuneDisplayName),
    n(rw?.sixthRuneDisplayName),
  ].filter(Boolean);

  const types = runewordAllTypes(rw);
  const mods = Array.isArray(rw?.displayProperties)
    ? rw.displayProperties.filter(
        (x) => x != null && String(x).trim() !== ""
      )
    : [];

  const shield = Array.isArray(rw?.shieldProperties)
    ? rw.shieldProperties.filter(Boolean)
    : [];
  const weapon = Array.isArray(rw?.weaponProperties)
    ? rw.weaponProperties.filter(Boolean)
    : [];
  const armor = Array.isArray(rw?.armorProperties)
    ? rw.armorProperties.filter(Boolean)
    : [];

  const rwSacreds = Array.isArray(rw?.sacreds) ? rw.sacreds : [];

  return (
    <>
      <div className="tipTitle">{title}</div>
      {types.length ? (
        <div className="tipSubtitle">{types.join(" / ")}</div>
      ) : null}

      <div className="hr" />
      {runes.length ? (
        <div className="runesDisplay">
          <Tip text={String(TOOLTIPS_TEXT_MAP["runes"])}>
            {runes.join(" · ")}
          </Tip>
        </div>
      ) : null}

      <div className="hr" />
      <div className="uniqueHeader">Properties</div>
      {mods.length ? (
        mods.map((m, i) => (
          <div key={i} className="runeModLine">
            {String(m)}
          </div>
        ))
      ) : (
        <div className="line dim">No properties listed.</div>
      )}


      {rwSacreds.length ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Sacreds</div>
          {rwSacreds.map((s, idx) => {
            const name = n(s?.sacredName);
            const typesText = Array.isArray(s?.itemTypes)
              ? s.itemTypes.filter(Boolean).join(" / ")
              : "";
            if (!name) return null;

            return (
              <div key={`${idx}::${name}`} className="line goToLink">
                {onGoSacred ? (
                  <a
                    href="#"
                    className="d2link"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onGoSacred(name, Array.isArray(s?.itemTypes) ? s.itemTypes : []);
                    }}
                    title={`Go to sacred: ${name}`}
                  >
                    {name} ({typesText})
                  </a>
                ) : (
                  <span className="d2linkText">{name}</span>
                )}
                {typesText ? (
                  <span className="dim"></span>
                ) : null}
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
}

function UniqueTooltip({ u }) {
  if (!u) return <div className="emptyState">Select an item.</div>;

  const title = n(u?.displayName) || "Unknown Unique";

  const base = uniqueBase(u);
  const baseName = n(base?.displayName) || n(base?.name) || "";
  const baseTypePretty = uniqueBaseTypeLabelPretty(u) || uniqueBaseTypeLabel(u);

  const mods = Array.isArray(u?.displayProperties)
    ? u.displayProperties.filter((x) => x != null && String(x).trim() !== "")
    : [];


  const dropSource = u?.dropSource;
  const dropRate = u?.dropRate;
  const occurrenceChance = u?.occurrenceChance;

  const hasDropSource = dropSource !== null && dropSource !== undefined && String(dropSource).trim() !== "";
  const hasDropRate = dropRate !== null && dropRate !== undefined && String(dropRate).trim() !== "";
  const hasOccurrenceChance = occurrenceChance !== null && occurrenceChance !== undefined && String(occurrenceChance).trim() !== "";
  const hasDropInfo = hasDropSource || hasDropRate || hasOccurrenceChance;
  const itemType = getItemTypeForUnique(u);
  const requiredLevel = getRequiredLevelForUnique(u, itemType);
  const requiredDexterity = getRequiredDexterityForUnique(u, itemType);
  const requiredStrength = getRequiredStrengthForUnique(u, itemType);
  const hasRequirements = (requiredLevel > 0 && requiredStrength > 0) || (requiredLevel > 0 && requiredDexterity > 0) || (requiredLevel > 0 && requiredDexterity > 0 && requiredStrength > 0);
  const creationOrb = u?.itemTier === "Normal" || u?.itemTier === "Exceptional" ? "Mythic Orb" : "Divine Orb";

  return (
    <>
      <div className="tipUniqueTitle">{title}</div>
      <div className="tipSubtitle">
        {baseName}
          
      </div>
      {u?.carryOne === "1" ? (
        <>
        <div className="carryOne">
          You can have only one in your inventory and stash!
        </div>
        </>
      ) : null}
          
        {has(u?.weaponBase) ? (
          <>
            <div className="hr" />
              {has(u?.displayOneHandDamage) && lineKV("One hand damage:", n(u?.displayOneHandDamage), "")}
              {has(u?.displayTwoHandDamage) && lineKV("Two hand damage:", n(u?.displayTwoHandDamage), "")}
          </>
        ) : null}

        {has(u?.armorBase) ? (
          <>
            <div className="hr" />
              {has(u?.displayDefense) && lineKV("Defense:", n(u?.displayDefense), "")}
          </>
        ) : null}

      <div className="hr" />
      <div className="uniqueHeader">Unique modifiers</div>

      {mods.length ? (
        mods.map((m, idx) => {
          const raw = String(m);
          const parts = raw.split("\n");
          const cls = classForPropertyLine(raw);

          return (
            <div key={idx} className={"uniqueMod " + cls}>
              {parts.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < parts.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </div>
          );
        })
      ) : (
        <div className="line dim">No modifiers listed.</div>
      )}

      {hasRequirements ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Requirements</div>
            {nz(requiredLevel) && lineKV("Required Level:", n(requiredLevel), "req")}
            {nz(requiredStrength) && lineKV("Required Strength:", n(requiredStrength), "req")}
            {nz(requiredDexterity) && lineKV("Required Dexterity:", n(requiredDexterity), "req")}
        </>
      ) : null}

      <div className="hr" />
      <div className="dropHeader">Additional item information</div>
      {has(baseTypePretty) && has(u?.weaponBase) && lineKV("Base type:", n(baseTypePretty), "dim")}
      {has(u?.itemTier) && lineKV("Item Tier:", n(u?.itemTier), "dim")}
      {has(u?.level) && lineKV("Quality Level:", n(u?.level), "", TOOLTIPS_TEXT_MAP["qualityLevel"])}
      {nz(u?.requiredLevel) && lineKV("Required Level:", n(u?.requiredLevel), "req")}
      {has(u?.code) && lineKV("Code:", n(u?.code), "dim", TOOLTIPS_TEXT_MAP["uniCode"])}
      {!has(u?.dropSource) && u?.showCanBeCreatedWith && lineKV("Can be created with:", n(creationOrb), "dim", TOOLTIPS_TEXT_MAP["mythicDivineOrb"])}

      {hasDropInfo ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Drop information</div>

          {hasDropSource && lineKV("Drop Source:", String(dropSource), "dim")}
          {hasDropRate && lineKV("Drop Rate:", String(dropRate), "dim", TOOLTIPS_TEXT_MAP["dropRate"])}
          {hasOccurrenceChance && lineKV("Occurence chance:", String(occurrenceChance), "dim", TOOLTIPS_TEXT_MAP["occurrenceChance"])}
        </>
      ) : null}
    </>
  );
}

function StaticDataPanel({ data, loading, error, search, onLink }) {
  const [openMap, setOpenMap] = React.useState({});

  const toggle = (id) => {
    setOpenMap((m) => {
      const current = m[id] ?? true;
      return { ...m, [id]: !current };
    });
  };

  if (loading) {
    return (
      <div className="helpPanel">
        <div className="helpTitle">Cube Recipes</div>
        <div className="helpBody">Loading cube data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="helpPanel">
        <div className="helpTitle">Cube Recipes</div>
        <div className="helpBody">
          Failed to load <code>Cube.json</code>:{" "}
          {String(error.message || error)}
        </div>
      </div>
    );
  }

  const all = Array.isArray(data) ? data : [];

  const filtered = React.useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return all;

    return all.filter((r) => {
      const title = (n(r?.title) || "").toLowerCase();

      const textArr = Array.isArray(r?.text) ? r.text : [r?.text];
      const textJoined = textArr
        .filter(Boolean)
        .join("\n")
        .toLowerCase();

      return title.includes(q) || textJoined.includes(q);
    });
  }, [all, search]);

  if (!filtered.length) {
    return (
      <div className="helpPanel">
        <div className="helpTitle">Cube Recipes</div>
        <div className="helpBody">
          <div className="emptyState">No cube recipes match your search.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {filtered.map((r, idx) => {
        const id = r.id || `${r.type || "recipe"}-${idx}`;
        const isOpen = openMap[id] ?? true;
        const title = n(r.title) || `Recipe ${idx + 1}`;
        const kind = n(r.type);

        return (
          <div key={id} className="infoPanel" style={{ marginBottom: 10 }}>
            <div className="infoHeader">
              <div className="infoTitle" style={{ fontSize: 18 }}>
                {title}
                {kind && (
                  <span
                    style={{
                      fontSize: 14,
                      marginLeft: 8,
                      color: "var(--muted)",
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 400,
                    }}
                  >
                    · {kind}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="infoToggle"
                onClick={() => toggle(id)}
              >
                {isOpen ? "Hide" : "Show"}
              </button>
            </div>

            {isOpen && (
              <div className="infoBody cubeInfoBody">
                <Markdown text={r.text} onLink={onLink} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function TabsBar({ tab, setTab }) {
  const leftKeys = ["weapons", "armors", "uniques", "runewords", "sacreds", "cube", "changes"];

  return (
    <div className="tabsPanel">
      <div className="tabsLeft">
        <div className="tabs">
          {leftKeys.map((key) => (
            <div
              key={key}
              className={"tab" + (tab === key ? " active" : "")}
              onClick={() => setTab(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setTab(key)
              }
            >
              {TABS[key]}
            </div>
          ))}
        </div>
      </div>

      <div className="tabsRight">
        <div
          className={"tab" + (tab === "help" ? " active" : "")}
          onClick={() => setTab("help")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && setTab("help")
          }
        >
          {TABS.help}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const weapons = useJson("Weapons.json");
  const armors = useJson("Armors.json");
  const uniques = useJson("Uniques.json");
  const runewords = useJson("Runewords.json");
  const sacreds = useJson("Sacreds.json");
  const cube = useJson("Cube.json");
  const changes = useJson("Changes.json");

  const INFO_OPEN_STORAGE_KEY = "the-archivist-v1";
  const searchInputRef = React.useRef(null);
  const skipAutoIndexRef = React.useRef(false);
  const cubeSearchInputRef = React.useRef(null);
  const changesSearchInputRef = React.useRef(null); 
  const skipFilterResetRef = React.useRef(false);
  const [pendingLinkTarget, setPendingLinkTarget] = useState(null);
  const [tab, setTab] = useState("weapons");

  const [infoOpenByTab, setInfoOpenByTab] = useState(() => ({
    weapons: true,
    armors: true,
    uniques: true,
    runewords: true,
    sacreds: true,
  }));

  const info = INFO_BY_TAB[tab] || { title: "About", text: "" };
  const infoOpen = !!infoOpenByTab[tab];

  const dataset =
  tab === "weapons" ? weapons :
  tab === "armors" ? armors :
  tab === "uniques" ? uniques :
  tab === "runewords" ? runewords :
  tab === "sacreds" ? sacreds :
  weapons; // fallback

  useEffect(() => {
    if (tab !== "cube") {
      setCubeSearch("");
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== "changes") {
      setChangesSearch("");
    }
  }, [tab]);

  useEffect(() => {
  try {
    const raw = window.localStorage.getItem(INFO_OPEN_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      setInfoOpenByTab((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  } catch (e) {
    console.warn("Failed to read info panel state from storage", e);
  }
}, []);

  const [search, setSearch] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [tierValue, setTierValue] = useState("");
  const [socketsValue, setSocketsValue] = useState("");
  const [cubeSearch, setCubeSearch] = useState("");
  const [changesSearch, setChangesSearch] = useState("");
  const [uberValue, setUberValue] = useState(false);
  const [pendingUniqueCode, setPendingUniqueCode] = useState("");
  const [pendingSacredMatch, setPendingSacredMatch] = useState(null);
  const [highlightOnly, setHighlightOnly] = useState(false);

  const items = dataset.data;

  const handleMarkdownAppLink = React.useCallback(
    ({ tab: targetTab, name }) => {
      const t = (targetTab || "").toLowerCase();
      const label = (name || "").trim();
      const hasName = !!label;
      const needle = label.toLowerCase();

      // --- Cube Recipes tab ---
      if (t === "cube") {
        setTab("cube");
        if (hasName) {
          setCubeSearch(needle);
          if (cubeSearchInputRef.current) {
            cubeSearchInputRef.current.focus();
            cubeSearchInputRef.current.select();
          }
        }
        // if no name → just jump to tab, keep existing cubeSearch as-is
        return;
      }

      // --- SoE changes tab ---
      if (t === "changes") {
        setTab("changes");
        if (hasName) {
          setChangesSearch(needle);
          if (changesSearchInputRef.current) {
            changesSearchInputRef.current.focus();
            changesSearchInputRef.current.select();
          }
        }
        return;
      }

      // --- item tabs (weapons / armors / uniques / runewords / sacreds) ---
      if (!TAB_KEYS.includes(t)) return;

      // If there's no name part, just jump to the tab and let normal
      // "tab change" behavior reset filters etc.
      if (!hasName) {
        setTab(t);
        return;
      }

      // Name present → full "go-to-item" behavior
      skipFilterResetRef.current = true;
      skipAutoIndexRef.current = true;

      setTab(t);
      setSearch(needle);
      setPendingLinkTarget({ tab: t, name: needle });
    },
    []
  );



  const typeOptions = useMemo(() => {
    if (!items.length) return [];

    if (tab === "weapons")
      return Array.from(new Set(items.map(weaponTypeForFilter).filter(Boolean))).sort();

    if (tab === "armors")
      return Array.from(new Set(items.map(armorTypeForFilter).filter(Boolean))).sort();

    if (tab === "uniques")
      return Array.from(new Set(items.map(uniqueBaseTypeLabel).filter(Boolean))).sort();

    if (tab === "runewords") {
      const all = items.flatMap(runewordAllTypes);
      return Array.from(new Set(all)).sort();
    }

    const all = items.flatMap(sacredTypes);
    return Array.from(new Set(all)).sort();
  }, [items, tab]);

  const tierOptions = useMemo(() => {
    const tiers = Array.from(new Set(items.map((it) => n(it?.itemTier)).filter(Boolean)));
    return tiers.sort((a, b) => {
      const an = Number(a),
        bn = Number(b);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
      return a.localeCompare(b);
    });
  }, [items]);

  useEffect(() => {
    // If we just switched tabs via an internal Markdown app: link,
    // skip resetting filters once.
    if (skipFilterResetRef.current) {
      skipFilterResetRef.current = false;
      return;
    }

    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue(false);
    setHighlightOnly(false);

    setActiveIndex(0);
  }, [tab]);

  const filtered = useMemo(() => {
    const { phrases, terms } = parseSearchQuery(search);

    return items.filter((it) => {
      const name = (n(it?.displayName) || n(it?.runewordName) || n(it?.name)).toLowerCase();

      const searchText = buildSearchTextForItem(tab, it);

      for (const p of phrases) {
        if (!searchText.includes(p)) return false;
      }

      for (const t of terms) {
        if (!searchText.includes(t)) return false;
      }
    

      if (tierValue && n(it?.itemTier) !== tierValue) return false;

      if (tab === "weapons") {
        if (typeValue && weaponTypeForFilter(it) !== typeValue) return false;
        if (socketsValue && Number(it?.maxSockets) !== Number(socketsValue)) return false;

        if (highlightOnly && !isHighlightedItem(it)) {
          return false;
        }
      }

      if (tab === "armors") {
        if (typeValue && armorTypeForFilter(it) !== typeValue) return false;
        if (socketsValue && Number(it?.maxSockets) !== Number(socketsValue)) return false;

        if (highlightOnly && !isHighlightedItem(it)) {
          return false;
        }
      }

      if (tab === "uniques") {
        if (typeValue && uniqueBaseTypeLabel(it) !== typeValue) return false;

        if (uberValue && !isUberUnique(it)) {
          return false;
        }

        if (highlightOnly && !isHighlightedItem(it)) {
          return false;
        }
      }

      if (tab === "runewords") {
        if (typeValue) {
          const types = runewordAllTypes(it);
          if (!types.includes(typeValue)) return false;
        }

        if (highlightOnly && !isHighlightedItem(it)) {
          return false;
        }
      }

      if (tab === "sacreds") {
        if (typeValue) {
          const types = sacredTypes(it);
          if (!types.includes(typeValue)) return false;
        }
      }

      return true;
    });
}, [items, tab, search, tierValue, typeValue, socketsValue, uberValue, highlightOnly]);

  useEffect(() => {
    if (!pendingLinkTarget) return;
    if (tab !== pendingLinkTarget.tab) return;
    if (dataset.loading) return;

    const targetName = pendingLinkTarget.name;

    const idx = filtered.findIndex((it) => {
      const nm = (
        n(it?.displayName) ||
        n(it?.runewordName) ||
        n(it?.name)
      ).toLowerCase();

      return nm === targetName;
    });

    if (idx >= 0) {
      setActiveIndex(idx);
    } else if (filtered.length) {
      setActiveIndex(0);
    }

    setPendingLinkTarget(null);
  }, [pendingLinkTarget, tab, dataset.loading, filtered]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (skipAutoIndexRef.current) {
      
      skipAutoIndexRef.current = false;
      return;
    }

    setActiveIndex(0);
  }, [tab, search, tierValue, typeValue, socketsValue, uberValue, highlightOnly]);

  useEffect(() => {
    if (!pendingUniqueCode) return;
    if (tab !== "uniques") return;
    if (dataset.loading) return;

    const idx = dataset.data.findIndex((it) => n(it?.code) === pendingUniqueCode);
    if (idx >= 0) setActiveIndex(idx);

    setPendingUniqueCode("");
  }, [pendingUniqueCode, tab, dataset.loading, dataset.data]);

    useEffect(() => {
    if (!pendingSacredMatch) return;
    if (tab !== "sacreds") return;
    if (sacreds.loading) return;

    const { name, types } = pendingSacredMatch;

    const all = sacreds.data;
    const idx = all.findIndex((s) => {
      const sName = n(s?.displayName).toLowerCase();
      if (name && sName !== name) return false;

      const sTypes = sacredTypes(s).map((t) => t.toLowerCase());
      for (const t of types) {
        if (!sTypes.includes(t)) return false;
      }
      return true;
    });

    if (idx >= 0) setActiveIndex(idx);

    setPendingSacredMatch(null);
  }, [pendingSacredMatch, tab, sacreds.loading, sacreds.data, setActiveIndex]);

  const activeItem = filtered[activeIndex] ?? null;

  function jumpToSacred(sacredName, itemTypes) {
    const name = n(sacredName);
    const types = Array.isArray(itemTypes)
      ? itemTypes.map((t) => n(t).toLowerCase()).filter(Boolean)
      : [];

    if (!name && !types.length) return;

    skipAutoIndexRef.current = true; 

    setTab("sacreds");

    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue(false);
    setHighlightOnly(false); 

    setPendingSacredMatch({
      name: name.toLowerCase(),
      types,
    });
  }

  function jumpToCode(code) {
    const c = n(code);
    if (!c) return;

    skipAutoIndexRef.current = true; 

    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue(false);
    setHighlightOnly(false); 

    const all = dataset.data;
    const idx = all.findIndex((it) => n(it?.code) === c);
    if (idx >= 0) setActiveIndex(idx);
  }

  function jumpToUnique(code) {
    const c = n(code);
    if (!c) return;

    skipAutoIndexRef.current = true; 

    setTab("uniques");

    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue(false);
    setHighlightOnly(false); 

    setPendingUniqueCode(c);
  }

  useEffect(() => {
    function onKeyDown(e) {

      if (e.key === "Escape") {
        if (tab === "cube") {
          cubeSearchInputRef.current?.blur();
        } else if (tab === "changes") {
          changesSearchInputRef.current?.blur();
        } else {
          searchInputRef.current?.blur();
        }
      }

      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        if (tab === "cube") {
          if (cubeSearchInputRef.current) {
            cubeSearchInputRef.current.focus();
            cubeSearchInputRef.current.select();
          }
        } else if (tab === "changes") {
          if (changesSearchInputRef.current) {
            changesSearchInputRef.current.focus();
            changesSearchInputRef.current.select();
          }
        } else {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
          }
        }
      }

      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) =>
          Math.min(i + 1, Math.max(filtered.length - 1, 0))
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();

        const idx = TAB_KEYS.indexOf(tab);
        if (idx === -1) return;

        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next =
          (idx + dir + TAB_KEYS.length) % TAB_KEYS.length;

        setTab(TAB_KEYS[next]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, filtered.length]);


  const subLabel = useMemo(() => {
    if (tab === "weapons") return (it) => weaponTypeLabel(it);
    if (tab === "armors") return (it) => armorTypeLabel(it);
    if (tab === "uniques") {
      return (it) => {
        const bt = uniqueBaseTypeLabelPretty(it) || uniqueBaseTypeLabel(it);
        const base = uniqueBase(it);
        const bn = n(base?.displayName) || n(base?.name);
        return bn ? `${bt}` : bt;
      };
    }
    if (tab === "sacreds") {
      return (it) => {
        const types = sacredTypes(it);
        return types.length ? types.join(" / ") : "Sacred";
      };
    }

    return (it) => {
      const types = runewordAllTypes(it);
      return types.length ? types.join(" / ") : "Runeword";
    };
  }, [tab]);

  const tinyLabel = useMemo(() => {
    if (tab === "weapons") {
      return (it) => {
        const parts = [];
        const dmg = weaponDmgLines(it);
        if (dmg.length) parts.push(`${dmg[0].k.replace(" Damage", "")}: ${dmg[0].v}`);
        if (nz(it?.requiredLevel)) parts.push(`Req Lvl ${n(it?.requiredLevel)}`);
        if (nz(it?.requiredStrength)) parts.push(`Str ${n(it?.requiredStrength)}`);
        if (nz(it?.requiredDexterity)) parts.push(`Dex ${n(it?.requiredDexterity)}`);
        if (nz(it?.maxSockets)) parts.push(`Sockets ${n(it?.maxSockets)}`);
        if (has(it?.itemTier)) parts.push(`Tier ${n(it?.itemTier)}`);
        return parts.join(" • ");
      };
    }

    if (tab === "armors") {
      return (it) => {
        const parts = [];
        const def = armorDefenseLine(it);
        if (has(def)) parts.push(`Defense: ${def}`);
        if (nz(it?.block)) parts.push(`Block ${n(it?.block)}%`);
        if (nz(it?.maxSockets)) parts.push(`Sockets ${n(it?.maxSockets)}`);
        if (nz(it?.requiredLevel)) parts.push(`Req Lvl ${n(it?.requiredLevel)}`);
        if (nz(it?.requiredStrength)) parts.push(`Str ${n(it?.requiredStrength)}`);
        if (has(it?.itemTier)) parts.push(`Tier ${n(it?.itemTier)}`);
        return parts.join(" • ");
      };
    }

    if (tab === "runewords") {
      return (it) => {
        const runes = [
          n(it?.firstRune),
          n(it?.secondRune),
          n(it?.thirdRune),
          n(it?.fourthRune),
          n(it?.fifthRune),
          n(it?.sixthRune),
        ].filter(Boolean);

        const count = runes.length ? `${runes.length} runes` : "";
        const props = Array.isArray(it?.displayProperties) ? it.displayProperties.filter(Boolean).length : 0;
        return [count, props ? `${props} mods` : ""].filter(Boolean).join(" • ");
      };
    }

    if (tab === "sacreds") {
      return (it) => {
        const ing = sacredIngredients(it);
        const map = it?.propertiesByItemType && typeof it.propertiesByItemType === "object"
          ? it.propertiesByItemType
          : {};
        const typeCount = Object.keys(map).length;
        return [
          ing.length ? `${ing.length} inputs` : "",
          typeCount ? `${typeCount} type variants` : "",
        ].filter(Boolean).join(" • ");
      };
    }

    return (it) => {
      const parts = [];
      if (nz(it?.requiredLevel)) parts.push(`Req Lvl ${n(it?.requiredLevel)}`);
      if (has(it?.level)) parts.push(`Quality Lvl ${n(it?.level)}`);
      if (has(it?.itemTier)) parts.push(`Tier ${n(it?.itemTier)}`);
      return parts.join(" • ");
    };
  }, [tab]);

  const title = getTitleByTab(tab);
  const countLabel = dataset.loading
    ? "Loading…"
    : dataset.error
    ? `Error: ${dataset.error.message}`
    : `${filtered.length} items`;

  const showSockets = tab === "weapons" || tab === "armors";
  const typePlaceholder =
    tab === "uniques" ? "All base types" :
    (tab === "runewords" || tab === "sacreds") ? "All item types" :
    "All types";

  return (
    <div className="appRoot">
      <div className="wrap">
        <TabsBar tab={tab} setTab={setTab} />


       {tab === "help" ? (
        <HelpPanel />
        ) : tab === "cube" ? (
        <>
          <div className="filtersStack">
            <div className="filtersPanel">
              <input
                type="text"
                ref={cubeSearchInputRef}
                value={cubeSearch}
                onChange={(e) => setCubeSearch(e.target.value)}
                className="searchBar"
                placeholder="Search cube recipes…"
              />
            </div>
          </div>
          <StaticDataPanel
            data={cube.data}
            loading={cube.loading}
            error={cube.error}
            search={cubeSearch}
            onLink={handleMarkdownAppLink}
          />
        </>
        ) : tab === "changes" ? (
        <>
          <div className="filtersStack">
            <div className="filtersPanel">
              <input
                type="text"
                ref={changesSearchInputRef}
                value={changesSearch}
                onChange={(e) => setChangesSearch(e.target.value)}
                className="searchBar"
                placeholder="Search SoE changes…"
              />
            </div>
          </div>
          <StaticDataPanel
            data={changes.data}
            loading={changes.loading}
            error={changes.error}
            search={changesSearch}
            onLink={handleMarkdownAppLink}
          />
        </>
        ) : (
        <>
          <div className="filtersStack">
            <FiltersBar
              search={search}
              setSearch={setSearch}
              typeValue={typeValue}
              setTypeValue={setTypeValue}
              tierValue={tierValue}
              setTierValue={setTierValue}
              socketsValue={socketsValue}
              setSocketsValue={setSocketsValue}
              uberValue={uberValue}
              setUberValue={setUberValue}
              types={typeOptions}
              tiers={tierOptions}
              showSockets={showSockets}
              showUber={tab === "uniques"}
              typePlaceholder={typePlaceholder}
              searchInputRef={searchInputRef}
              showTier={tab !== "runewords" && tab !== "sacreds"} 
              showHighlight={tab === "uniques" || tab === "runewords" || tab === "weapons" || tab === "armors"}
              highlightOnly={highlightOnly}
              setHighlightOnly={setHighlightOnly} 
            />
              <InfoPanel
                title={info.title}
                markdownText={info.text}
                isOpen={infoOpen}
                onLink={handleMarkdownAppLink}
                onToggle={() =>
                  setInfoOpenByTab((prev) => {
                    const next = { ...prev, [tab]: !prev[tab] };
                    try {
                      window.localStorage.setItem(
                        INFO_OPEN_STORAGE_KEY,
                        JSON.stringify(next)
                      );
                    } catch (e) {
                      console.warn("Failed to save info panel state", e);
                    }
                    return next;
                  })
                }
              />
          </div>
          
          <ListPanel
            tab={tab}
            title={title}
            countLabel={countLabel}
            items={filtered}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            subLabel={subLabel}
            tinyLabel={tinyLabel}
          />

          <TooltipShell>
            {tab === "weapons" && (
            <WeaponTooltip
              w={activeItem}
              onGoCode={jumpToCode}
              onGoUnique={jumpToUnique}
            />
            )}

            {tab === "runewords" && <RunewordTooltip rw={activeItem} onGoSacred={jumpToSacred} />}

            {tab === "armors" && (
              <ArmorTooltip
                a={activeItem}
                onGoCode={jumpToCode}
                onGoUnique={jumpToUnique}
              />
            )}
            {tab === "uniques" && <UniqueTooltip u={activeItem} />}
            {tab === "sacreds" && <SacredTooltip s={activeItem} />}
          </TooltipShell>
        </>)}
      </div>

      <footer className="footer">
        <div className="footerInner">
        <span className="footerLeft">by <a className="footerGitLink" target= "_blank" href="https://github.com/Lukaszpg">MindH1ve</a></span>
        <span className="footerRight">v{APP_VERSION}</span>
        </div>
      </footer>
   </div>
  );
}