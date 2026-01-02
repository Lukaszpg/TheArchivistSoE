import React, { useEffect, useMemo, useState } from "react";

const TABS = {
  weapons: "Weapons",
  armors: "Armors",
  uniques: "Uniques",
  runewords: "Runewords",
};

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

function runewordTypeForFilter(rw) {
  // Prefer readable types if available, else fall back to raw itemTypes codes.
  const a = Array.isArray(rw?.displayItemTypes) ? rw.displayItemTypes : [];
  if (a.length) return a[0];
  const b = Array.isArray(rw?.itemTypes) ? rw.itemTypes : [];
  return b[0] || "";
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

// ---- type label logic (mirrors the provided index.html) ----
function weaponTypeLabel(w) {
  const primary = n(w?.itemType?.displayName) || n(w?.displayType) || n(w?.type);
  const secondary =
    n(w?.secondItemType?.displayName) || n(w?.secondDisplayType) || n(w?.secondType);
  return has(secondary) ? `${primary} / ${secondary}` : primary || "weapon";
}

function weaponTypeForFilter(w) {
  return n(w?.itemType?.itemType) || n(w?.type);
}

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
};

const TOOLTIPS_TEXT_MAP = {
  "qualityLevel": "Quality level is a stat that determines to\n which treasure class the item belongs. \nIt's important for gambling (higher quality\n level means lower chance to upgrade the\n item tier) and unique item drop generation,\n as items with higher quality level tend\n to drop less.",
  "runes": "Runes here are shown in the exact order\n you should put them in your item to create\n a runeword."
};

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

function iconText(it) {
  const c = n(it?.code).toUpperCase();
  return c ? c.slice(0, 3) : "ITM";
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
    const url = `${import.meta.env.BASE_URL}data/${fileName}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((err) =>
        setState({ loading: false, data: [], error: err.message })
      );
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
}) {
  return (
    <div className="filtersPanel">
      <input
        type="text"
        value={search}
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

      {showUber && (
        <select
          value={uberValue}
          onChange={(e) => setUberValue(e.target.value)}
          style={{ maxWidth: 240 }}
        >
          <option value="">Uber Boss Unique (All)</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )}

      <button
        type="button"
        className="btn"
        onClick={() => {
          setSearch("");
          setTypeValue("");
          setTierValue("");
          setSocketsValue("");
          setUberValue("");
        }}
      >
        Reset
      </button>
    </div>
  );
}

function ListPanel({ title, countLabel, items, activeIndex, setActiveIndex, subLabel, tinyLabel }) {
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
          items.map((it, i) => (
            <div
              key={`${i}::${n(it?.code)}::${n(it?.displayName) || n(it?.name)}`}
              ref={i === activeIndex ? activeRowRef : null}
              className={"row" + (i === activeIndex ? " active" : "")}
              onClick={() => setActiveIndex(i)}
              role="listitem"
            >
              <div className="ico">{iconText(it)}</div>
              <div className="meta">
                <div className="name">{n(it?.displayName) || n(it?.name) || "Unknown"}</div>
                <div className="sub">{subLabel(it)}</div>
                <div className="tiny">{tinyLabel(it)}</div>
              </div>
            </div>
          ))
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
          <div key={`${idx}::${name}::${code}`} className="line">
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
      {lineKV("Code:", n(w?.code), "dim")}
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
      {has(a?.level) && lineKV("Quality Level:", n(a?.level))}
      {lineKV("Code:", n(a?.code), "dim")}
      <TierLinks label="Tiers:" entries={tierEntries} onGo={onGoCode} />
      <UniquesPanel uniques={a?.uniques} onGoUnique={onGoUnique} />
    </>
  );
}

function RunewordTooltip({ rw }) {
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
  const mods = Array.isArray(rw?.displayProperties) ? rw.displayProperties.filter((x) => x != null && String(x).trim() !== "") : [];

  const shield = Array.isArray(rw?.shieldProperties) ? rw.shieldProperties.filter(Boolean) : [];
  const weapon = Array.isArray(rw?.weaponProperties) ? rw.weaponProperties.filter(Boolean) : [];
  const armor = Array.isArray(rw?.armorProperties) ? rw.armorProperties.filter(Boolean) : [];

  return (
    <>
      <div className="tipTitle">{title}</div>
      {types.length ? <div className="tipSubtitle">{types.join(" / ")}</div> : null}

      <div className="hr" />
      {runes.length ? lineKV("Runes:", runes.join(" · "), "dim", TOOLTIPS_TEXT_MAP["runes"]) : null}

      <div className="hr" />
      <div className="uniqueHeader">Properties</div>
      {mods.length ? mods.map((m, i) => <div key={i} className="line">{String(m)}</div>) : <div className="line dim">No properties listed.</div>}

      {(shield.length || weapon.length || armor.length) ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Additional mods from runes</div>
          {shield.length ? (
            <>
              {shield.map((s, i) => <div key={`s-${i}`} className="line">{String(s)}</div>)}
            </>
          ) : null}

          {weapon.length ? (
            <>
              {weapon.map((w, i) => <div key={`w-${i}`} className="line">{String(w)}</div>)}
            </>
          ) : null}

          {armor.length ? (
            <>
              {armor.map((a, i) => <div key={`a-${i}`} className="line">{String(a)}</div>)}
            </>
          ) : null}
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
  const hasDropInfo = hasDropSource || hasDropRate;
  const itemType = getItemTypeForUnique(u);
  const requiredLevel = getRequiredLevelForUnique(u, itemType);
  const requiredDexterity = getRequiredDexterityForUnique(u, itemType);
  const requiredStrength = getRequiredStrengthForUnique(u, itemType);
  const hasRequirements = (requiredLevel > 0 && requiredStrength > 0) || (requiredLevel > 0 && requiredDexterity > 0) || (requiredLevel > 0 && requiredDexterity > 0 && requiredStrength > 0);

  return (
    <>
      <div className="tipUniqueTitle">{title}</div>
      <div className="tipSubtitle">
        {baseName}
          
      </div>


    {has(u?.weaponBase) ? (
        <>
        </>
      ) : null}

      <div className="hr" />
      <div className="uniqueHeader">Unique modifiers</div>

      {mods.length ? (
        mods.map((m, idx) => {
          const parts = String(m).split("\n");
          return (
            <div key={idx} className="uniqueMod">
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
      {has(baseTypePretty) && lineKV("Base type:", n(baseTypePretty), "dim")}
      {has(u?.itemTier) && lineKV("Item Tier:", n(u?.itemTier), "dim")}
      {has(u?.level) && lineKV("Quality Level:", n(u?.level))}
      {nz(u?.requiredLevel) && lineKV("Required Level:", n(u?.requiredLevel), "req")}
      {has(u?.code) && lineKV("Code:", n(u?.code), "dim")}

      {hasDropInfo ? (
        <>
          <div className="hr" />
          <div className="dropHeader">Drop information</div>

          {hasDropSource && lineKV("Drop Source:", String(dropSource), "dim")}
          {hasDropRate && lineKV("Drop Rate:", String(dropRate), "dim")}
          {hasOccurrenceChance && lineKV("Occurence chance:", String(occurrenceChance), "dim")}
        </>
      ) : null}
    </>
  );
}

function TabsBar({ tab, setTab }) {
  return (
    <div className="tabsPanel">
      <div className="tabs">
        {Object.entries(TABS).map(([key, label]) => (
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
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const weapons = useJson("Weapons.json");
  const armors = useJson("Armors.json");
  const uniques = useJson("Uniques.json");
  const runewords = useJson("Runewords.json");

  const [tab, setTab] = useState("weapons");
  const dataset =
  tab === "weapons" ? weapons :
  tab === "armors" ? armors :
  tab === "uniques" ? uniques :
  tab === "runewords" ? runewords :
  weapons; // fallback

  // shared controls
  const [search, setSearch] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [tierValue, setTierValue] = useState("");
  const [socketsValue, setSocketsValue] = useState("");
  const [uberValue, setUberValue] = useState("");
  const [pendingUniqueCode, setPendingUniqueCode] = useState("");

  const items = dataset.data;

 const typeOptions = useMemo(() => {
  if (!items.length) return [];
    if (tab === "weapons")
      return Array.from(new Set(items.map(weaponTypeForFilter).filter(Boolean))).sort();
    if (tab === "armors")
      return Array.from(new Set(items.map(armorTypeForFilter).filter(Boolean))).sort();
    if (tab === "uniques")
      return Array.from(new Set(items.map(uniqueBaseTypeLabel).filter(Boolean))).sort();

    // runewords
    const all = items.flatMap(runewordAllTypes);
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
    // reset all filters on tab switch
    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue("");

    // optional: reset selection too
    setActiveIndex(0);
  }, [tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((it) => {
      const name = (n(it?.displayName) || n(it?.runewordName) || n(it?.name)).toLowerCase();
      if (q && !name.includes(q)) return false;

      if (tierValue && n(it?.itemTier) !== tierValue) return false;

      if (tab === "weapons") {
        if (typeValue && weaponTypeForFilter(it) !== typeValue) return false;
        if (socketsValue && Number(it?.maxSockets) !== Number(socketsValue)) return false;
      }

      if (tab === "armors") {
        if (typeValue && armorTypeForFilter(it) !== typeValue) return false;
        if (socketsValue && Number(it?.maxSockets) !== Number(socketsValue)) return false;
      }

      if (tab === "uniques") {
        if (typeValue && uniqueBaseTypeLabel(it) !== typeValue) return false;

        // Uber Boss Unique filter:
        // Yes  => dropSource is NOT null/undefined
        // No   => dropSource IS null/undefined
        if (uberValue === "yes") {
          if (it?.dropSource === null || it?.dropSource === undefined) return false;
        } else if (uberValue === "no") {
          if (it?.dropSource !== null && it?.dropSource !== undefined) return false;
        }
      }

      if (tab === "runewords") {
        if (typeValue) {
          const types = runewordAllTypes(it);
          if (!types.includes(typeValue)) return false;
        }
      }

      return true;
    });
}, [items, tab, search, tierValue, typeValue, socketsValue, uberValue]);

  // selection
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
   setActiveIndex(0);
  }, [tab, search, tierValue, typeValue, socketsValue, uberValue]);

  
  useEffect(() => {
    if (!pendingUniqueCode) return;
    if (tab !== "uniques") return;
    if (dataset.loading) return;

    const idx = dataset.data.findIndex((it) => n(it?.code) === pendingUniqueCode);
    if (idx >= 0) setActiveIndex(idx);

    setPendingUniqueCode(""); // consume
  }, [pendingUniqueCode, tab, dataset.loading, dataset.data]);

  const activeItem = filtered[activeIndex] ?? null;

  // Jump to an item by code (normalTierCode / exceptionalTierCode / eliteTierCode)
  function jumpToCode(code) {
    const c = n(code);
    if (!c) return;

    // clear filters so the target is visible
    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue("");

    const all = dataset.data;
    const idx = all.findIndex((it) => n(it?.code) === c);
    if (idx >= 0) setActiveIndex(idx);
  }

  function jumpToUnique(code) {
    const c = n(code);
    if (!c) return;

    setTab("uniques");

    setSearch("");
    setTypeValue("");
    setTierValue("");
    setSocketsValue("");
    setUberValue("");

    setPendingUniqueCode(c);
  }

  useEffect(() => {
    function onKeyDown(e) {
      // Do not interfere with typing in inputs/selects
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) =>
          Math.min(i + 1, filtered.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) =>
          Math.max(i - 1, 0)
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filtered.length]);


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
    // runewords
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

    return (it) => {
      const parts = [];
      if (nz(it?.requiredLevel)) parts.push(`Req Lvl ${n(it?.requiredLevel)}`);
      if (has(it?.level)) parts.push(`Quality Lvl ${n(it?.level)}`);
      if (has(it?.itemTier)) parts.push(`Tier ${n(it?.itemTier)}`);
      return parts.join(" • ");
    };
  }, [tab]);

  const title = tab === "weapons" ? "Weapons" : tab === "armors" ? "Armors" : "Uniques";
  const countLabel = dataset.loading
    ? "Loading…"
    : dataset.error
    ? `Error: ${dataset.error.message}`
    : `${filtered.length} items`;

  const showSockets = tab === "weapons" || tab === "armors";
  const typePlaceholder =
    tab === "uniques" ? "All base types" :
    tab === "runewords" ? "All item types" :
    "All types";

  return (
    <div className="wrap">
      <TabsBar tab={tab} setTab={setTab} />

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
      />

      <ListPanel
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

        {tab === "runewords" && <RunewordTooltip rw={activeItem} />}

        {tab === "armors" && (
          <ArmorTooltip
            a={activeItem}
            onGoCode={jumpToCode}
            onGoUnique={jumpToUnique}
          />
        )}
        {tab === "uniques" && <UniqueTooltip u={activeItem} />}
      </TooltipShell>
    </div>
  );
}