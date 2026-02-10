# SPT-Realism Mod - AI Coding Instructions

## Project Overview

**SPT-Realism** is a TypeScript-based mod for Single Player Tarkov (SPT) that adds realistic gameplay mechanics and adjusts item values. The mod uses a **hybrid architecture**: JSON template files define game data, while TypeScript source code implements game logic modifications.

## Architecture & Key Concepts

### Template System
- **Templates define item properties**: Located in `db/templates/` organized by category
- **JSON structure**: Each item entry uses an ItemID (Tarkov's 24-character hex ID) as the object key
- **Core arrays structure**: `{ ItemID: { $type, ItemID, Name, ...properties } }`
- **Templates are context-dependent**: Same property name may have different meaning in different `$type` classes

### $type Property (Critical!)
- Maps to C# class in the mod's compiled code: `"$type": "RealismMod.WeaponMod, RealismMod"`
- Determines which properties are valid for that item (items ignore unknown properties)
- Common types:
  - `RealismMod.WeaponMod` - attachments, magazines, weapon parts
  - `RealismMod.Consumable` - meds, food, stims
- **Always verify the $type before adding properties** - wrong properties silently fail

### ItemID System
- 24-character hex strings from base Tarkov game: `"644a3df63b0b6f03e101e065"`
- **ItemID must exist in base game** - mod only rebalances, doesn't create items
- All items must have matching `ItemID` key and `"ItemID"` property value

## File Organization Structure

```
db/templates/
├── attachments/          # Sights, lasers, grips, barrels, etc.
│   ├── FlashlightLaserTemplates.json
│   ├── MagazineTemplates.json
│   ├── ScopeTemplates.json
│   └── ... (see directory for full list)
├── consumables/          # Meds and food
│   ├── meds.json         # Medical items (painkillers, bloodstoppers, etc.)
│   └── food.json         # Consumable food/drink
├── weapons/              # Weapon platform templates
│   ├── AssaultRifleTemplates.json
│   ├── PistolTemplates.json
│   └── ... (categorized by weapon type)
└── user_templates/       # Community-contributed content
    ├── [3]新武器-SianydeAndAPCness.json
    └── ... (user mods)

config/
└── config.json          # 50+ feature flags (boolean toggles for features)

src/
├── mod.ts               # Entry point, implements SPT mod interfaces
├── weapons/             # Weapon-related code
│   └── attatchment_base.ts
├── items/              # Item modification code
│   ├── meds.ts
│   └── items.ts
├── bots/               # Bot generation and equipment
│   ├── bots.ts
│   └── bot_gen.ts
├── traders/            # Trader and fleamarket modifications
└── utils/              # Utilities and helpers
```

## Common Workflows

### Adding/Modifying an Item
1. Identify the item's ItemID (search existing JSONs or Tarkov wiki)
2. Create entry under correct category (attachments/consumables/weapons)
3. Set `"$type": "RealismMod.WeaponMod"` (most common for attachments)
4. Add `"ItemID"` and `"Name"` properties
5. Add relevant properties: `Ergonomics`, `Weight`, `ReloadSpeed`, `LoyaltyLevel`

**Example attachment modification**:
```json
"644a3df63b0b6f03e101e065": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "644a3df63b0b6f03e101e065",
    "Name": "tactical_all_bemeyers_mawl_c1_plus",
    "Ergonomics": -1,
    "Weight": 0.28,
    "VerticalRecoil": 0,
    "HorizontalRecoil": 0,
    "LoyaltyLevel": 4
}
```

### Adjusting Weapons
- Edit `db/templates/weapons/[WeaponType]Templates.json`
- Key properties: `Ergonomics`, `VerticalRecoil`, `HorizontalRecoil`, `Accuracy`, `RateOfFire`
- Weapons often have larger property sets than attachments

### Modifying Consumables
- Edit `db/templates/consumables/meds.json` or `food.json`
- Key properties: `Duration`, `Delay`, `Strength`, `EffectPeriod`
- Example: pain relief duration altered by changing `Duration` value (in seconds)

### Enabling/Disabling Features
- Edit `config/config.json` - feature flags control major behaviors
- Example flags: `realistic_zombies`, `realistic_ballistics`, `recoil_attachment_overhaul`
- Changes take effect on mod reload

## Common Property Patterns

| Property | Type | Usage | Notes |
|----------|------|-------|-------|
| ItemID | string | Unique identifier | Must exist in base game |
| $type | string | Class mapping | Determines valid properties |
| Name | string | Item name in templates | Internal reference, not display name |
| Ergonomics | number | Weapon handling bonus/penalty | Negative = worse handling |
| Weight | number | Item weight | In kilograms |
| ReloadSpeed | number | Magazine reload speed | Higher = faster |
| VerticalRecoil | number | Vertical recoil adjustment | Negative = less recoil |
| HorizontalRecoil | number | Horizontal recoil adjustment | Negative = less recoil |
| LoyaltyLevel | number | Trader loyalty requirement | 1-4, gated by trader level |
| MalfunctionChance | number | Magazine jam probability | 0.005 = 0.5% |
| ConflictingItems | array | Incompatible items | Empty array for none |

## Editor Conventions

### JSON Formatting
- **Indentation**: 4 spaces (not tabs)
- **Line endings**: LF (Unix style)
- **No trailing commas** in JSON objects/arrays
- **ItemID as key is critical** - don't restructure to arrays

### Naming Conventions
- Template file names: `[PluralCategoryName]Templates.json` (e.g., `MagazineTemplates.json`)
- User contributions: Prefix with identifier (e.g., `AuthorName-WeaponAK105.json`)
- Property names: camelCase (JavaScript convention)

## Important Development Notes

1. **Template validation requires SPT mod loading** - syntax errors only visible at runtime
2. **Property order doesn't matter** - JSON object maps, not arrays
3. **Missing properties use SPT defaults** - only override if different
4. **User templates are loaded after core** - can override base game items
5. **Chinese characters are valid** - file names support Unicode (e.g., `[3]新武器-SianydeAndAPCness.json`)
6. **ItemID uniqueness**: Keys must be unique within a file, but can redefine base items

## When Modifying This Codebase

- **For balance changes**: Edit `/db/templates/` JSON files
- **For new features**: Modify `src/mod.ts` and supporting modules
- **For feature flags**: Update `config/config.json` and corresponding code in `src/`
- **For template schema changes**: Update multiple files (JSON + TypeScript class definitions in compiled mod)

## Quick References

- **SPT Documentation**: SPT mod loader interfaces (IPreSptLoadMod, IPostDBLoadMod)
- **Tarkov ItemIDs**: Available in base game database or wiki
- **Template validation**: Look at existing files of same $type for patterns
- **TypeScript dependencies**: Uses `@spt/*` packages from SPT framework
