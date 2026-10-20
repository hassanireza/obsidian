<div align="center">

<img src="docs/readme/banner.svg" width="100%" alt="Obsidian Game Store banner: 11 titles, 7 genre shelves, no backend."/>

<br/>

<!-- identity -->
<a href="https://github.com/hassanireza/obsidian/actions/workflows/deploy.yml"><img src="docs/readme/badges/deploy.svg" height="32" alt="Deploys with GitHub Actions"/></a>
<img src="docs/readme/badges/titles.svg" height="32" alt="11 titles"/>
<img src="docs/readme/badges/shelves.svg" height="32" alt="7 genre shelves"/>
<img src="docs/readme/badges/private.svg" height="32" alt="Private portfolio project"/>

<br/>

<!-- stack -->
<a href="https://react.dev"><img src="docs/readme/badges/react.svg" height="32" alt="React 19"/></a>
<a href="https://www.typescriptlang.org"><img src="docs/readme/badges/typescript.svg" height="32" alt="TypeScript 6.0"/></a>
<a href="https://vitejs.dev"><img src="docs/readme/badges/vite.svg" height="32" alt="Vite 8"/></a>

<br/>

<!-- platform -->
<img src="docs/readme/badges/spa.svg" height="32" alt="Static single page app"/>
<a href="#architecture"><img src="docs/readme/badges/no-backend.svg" height="32" alt="No backend"/></a>
<a href="https://hassanireza.github.io/obsidian/"><img src="docs/readme/badges/github-pages.svg" height="32" alt="Hosted on GitHub Pages"/></a>

<br/><br/>

*A React and TypeScript rebuild of the Obsidian game catalog, deployed as a static single page app to GitHub Pages.*

<br/>

[Overview](#overview) · [Architecture](#architecture) · [Catalog](#catalog) · [About](#about-this-repository)

</div>

---

<a id="overview"></a>
## <img src="docs/readme/icons/store.svg" width="24" height="24" align="absmiddle" alt=""/> Overview

**Obsidian Game Store** is a storefront for a catalog of browser games. Eleven titles sit on seven genre shelves, and every entry is a discrete repository composed into a single storefront by `src/data/games.ts`.

The app is a static single page build with no backend of its own, hosted on GitHub Pages and built with React 19, TypeScript 6.0 and Vite 8.

---

<a id="architecture"></a>
## <img src="docs/readme/icons/layers.svg" width="24" height="24" align="absmiddle" alt=""/> Architecture

![Data flow from games.ts through categories, grid and card components, into the app pages, into the GitHub Actions deploy pipeline](docs/readme/architecture.svg)

Data flows one way. `games.ts` feeds the categories, the grid lays each shelf out, card components render each title, the app pages assemble the storefront, and the GitHub Actions pipeline builds and deploys the result.

---

<a id="catalog"></a>
## <img src="docs/readme/icons/gem.svg" width="24" height="24" align="absmiddle" alt=""/> Catalog

Eleven titles across seven genre shelves, each entry a discrete repository composed into a single storefront by `src/data/games.ts`.

![Eleven titles across seven genre shelves](docs/readme/catalog.svg)

<br/>

<table>
<tr>
<td width="220"><img src="public/covers/obelisk-drift.webp" alt="Obelisk Drift" width="200" /></td>
<td>

### Obelisk Drift
*Every stone remembers its fall.*

A gravity physics ritual across a submerged ruin. Draw the fragment back, release it into the dark, and let each chamber's wells and currents carry it to the socket that calls it home. Ten chambers, real momentum, no two wells pull the same way twice.

<img src="docs/readme/icons/blocks.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Arcade &nbsp;·&nbsp; **Developer:** Obsidian Originals &nbsp;·&nbsp; <img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Editors' Choice**

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/arcana.webp" alt="ARCANA: Night City Tarot" width="200" /></td>
<td>

### ARCANA: Night City Tarot
*Read the cards of Night City.*

A cyberpunk tarot experience covering all 22 Major Arcana cards, reimagined for a rain drenched neon city. Draw a single card, browse the full deck, or pull a three card past, present, future spread.

<img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Mystical &nbsp;·&nbsp; **Developer:** Night City Dev &nbsp;·&nbsp; <img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Editors' Choice**

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/checkmate.webp" alt="CheckMate" width="200" /></td>
<td>

### CheckMate
*History's greatest moves. Solved by you.*

A curated chess puzzle collection built from decisive tactics played by Morphy, Fischer, Tal and Kasparov. A context aware hint system scales from beginner to grandmaster.

<img src="docs/readme/icons/board.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Puzzle &amp; Strategy &nbsp;·&nbsp; **Developer:** CheckMate Labs &nbsp;·&nbsp; <img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Editors' Choice**

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/monarch-room.webp" alt="Monarch Room" width="200" /></td>
<td>

### Monarch Room
*Private Texas Hold'em.*

A private Texas Hold'em room with the elegance of a members only club. Face adaptive opponents and track VPIP, showdown rate and full hand history.

<img src="docs/readme/icons/cards.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Card &nbsp;·&nbsp; **Developer:** Monarch Studios &nbsp;·&nbsp; <img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Editors' Choice**

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/aurum-maze.webp" alt="Aurum Maze" width="200" /></td>
<td>

### Aurum Maze
*Ten levels. One golden line.*

A minimal arcade chase built from black space, architectural white linework and pure gold. Guide a runner through ten handcrafted mazes while four rivals hunt the same paths.

<img src="docs/readme/icons/blocks.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Arcade &nbsp;·&nbsp; **Developer:** Obsidian Originals &nbsp;·&nbsp; <img src="docs/readme/icons/spark.svg" width="16" height="16" align="absmiddle" alt=""/> **Editors' Choice**

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/cosmodrome.webp" alt="CosmoDrome" width="200" /></td>
<td>

### CosmoDrome
*An endless drift through the dark.*

A nostalgic endless space racer set deep in the drift of an alien cosmos. Steer through asteroid fields and face sector bosses with a combo multiplier on the line.

<img src="docs/readme/icons/route.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Racing &nbsp;·&nbsp; **Developer:** CosmoDrome Studios

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/voidrunner.webp" alt="VoidRunner" width="200" /></td>
<td>

### VoidRunner
*Sprint. Shoot. Survive.*

A high speed combat runner across the red sands of the Martian frontier. Jump, slide and fire an infinite energy laser as difficulty scales with every second.

<img src="docs/readme/icons/bolt.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Action &nbsp;·&nbsp; **Developer:** Driftline Games

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/skyfold.webp" alt="Skyfold Aviary" width="200" /></td>
<td>

### Skyfold Aviary
*Rise through the floating layers.*

A serene aerial run through layered floating terraces. Manage beam energy while navigating procedurally generated obstacle patterns across endless vertical layers.

<img src="docs/readme/icons/blocks.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Arcade &nbsp;·&nbsp; **Developer:** Driftline Games

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/reliquary.webp" alt="Reliquary" width="200" /></td>
<td>

### Reliquary
*Stack. Clear. Survive.*

A high energy take on the classic block stacking format. Stack falling pieces to clear lines and climb the leaderboard before the grid fills up.

<img src="docs/readme/icons/board.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Puzzle &amp; Strategy &nbsp;·&nbsp; **Developer:** Vespers

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/abyssal-bloom.webp" alt="Abyssal Bloom" width="200" /></td>
<td>

### Abyssal Bloom
*Connect. Cascade. Score.*

A tactical grid based puzzle that rewards pattern recognition and forward thinking. Connect pathways on the neural network grid before the board locks up.

<img src="docs/readme/icons/board.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Puzzle &amp; Strategy &nbsp;·&nbsp; **Developer:** Vespers

</td>
</tr>
<tr>
<td width="220"><img src="public/covers/covenant.webp" alt="Covenant" width="200" /></td>
<td>

### Covenant
*Deceptively simple. Endlessly strategic.*

The two player classic with a smart AI opponent and a clean local multiplayer mode. Subtle animations reward every winning line.

<img src="docs/readme/icons/covenant.svg" width="16" height="16" align="absmiddle" alt=""/> **Genre:** Classic &nbsp;·&nbsp; **Developer:** Vespers

</td>
</tr>
</table>

---

<a id="about-this-repository"></a>
## <img src="docs/readme/icons/lock.svg" width="24" height="24" align="absmiddle" alt=""/> About this repository

This is a private portfolio project. It is not open to external contributions, forks intended for submission, or collaboration requests.

---

<div align="center">

<br/>

<img src="docs/readme/footer.svg" width="640" alt="Obsidian Game Store: React, TypeScript, Vite and GitHub Pages."/>

<br/>

<sub>Built with React, TypeScript, and Vite. No dependencies at runtime beyond the browser.</sub>

</div>
