# Sprite Replicator Revitalization Rough Spec

## Purpose

Sprite Replicator is a standalone and Photopea-friendly particle image generator for building sprite, texture, light, debris, atmosphere, and pseudo-3D effects from one or more source textures. The revitalized version should keep the immediacy of the current tool while replacing the old "base plus duplicates" mental model with a more expressive parameter-distribution workflow.

The primary user should be able to quickly create a particle field, tune its appearance interactively, export a transparent PNG, and, when embedded in Photopea, send the result back into the active document.

## Product Goals

- Make texture selection and weighting a first-class workflow.
- Replace fixed variance controls with per-parameter distributions.
- Improve preview ergonomics: resize, zoom, pan, and inspect without changing the generated camera.
- Improve camera/depth rendering, especially fog color and field blur.
- Support non-rectangular spatial distributions such as radial, cylindrical, and spherical layouts.
- Preserve deterministic generation through seeds.
- Keep standalone web usage and Photopea integration.
- Leave room for a Photoshop build without coupling the core generator to Photopea APIs.

## Non-Goals For The First Revamp

- A full physics simulator.
- Timeline animation or video export.
- Node-based procedural graph editing.
- Multi-document asset management.
- Native Photoshop plugin packaging, unless the core architecture is already clean enough to support it later.

## Current State Summary

The current app is a compact Svelte/Vite application. Most generator state, UI, sprite generation, rendering, and export logic lives in `src/routes/+page.svelte`.

Current capabilities:

- Built-in texture list plus custom image import.
- Optional Photopea smart object import.
- Base sprite with duplicate count.
- Uniform signed variance for position, size, angle, alpha, exposure, hue, saturation, and density.
- Perspective projection using camera distance, vanishing point, view factor, and sprite Z.
- CSS filter based blur/fog/color changes.
- Simple gravity-like force with mass fading.
- Export to PNG or open result back into Photopea.

Current limitations:

- Generator model is tied to base/duplicate terminology.
- Randomness controls are mostly symmetric uniform variances.
- Texture choice is random uniform across selected textures.
- Preview wheel changes camera distance rather than acting as a viewport zoom.
- Fog reduces contrast toward gray/flatness rather than compositing toward a chosen fog color.
- Field blur uses browser CSS blur, which is fast but visually limited.
- Most logic is difficult to test because generation, rendering, and UI are intertwined.

## Proposed User Model

The user configures a particle system made of:

- Canvas/output settings.
- A texture library and texture sampling rules.
- A particle count.
- Parameter distributions for position, size, rotation, color, alpha, blending, depth, and optional physical properties.
- Camera and depth rendering settings.
- Optional forces/modifiers that transform generated particles after sampling.

Each particle is sampled from the configured distributions using a deterministic seeded RNG. The renderer then projects, sorts, filters, composites, and exports the result.

## Information Architecture

Suggested collapsible sections:

- Output
- Textures
- Position
- Size & Rotation
- Color & Blending
- Camera & Depth
- Forces
- Preview
- Export
- Presets

This replaces the current `Base`, `Duplicates`, `Camera`, and `Forces` structure with sections that match creative intent.

## Texture Library

### Requirements

- Allow built-in textures and user-uploaded textures to exist in one library.
- Show texture thumbnails, names, dimensions, and source type.
- Support adding, replacing, duplicating, deleting, and reordering textures.
- Support Photopea import from current layer or smart object when embedded.
- Store per-texture sampling weight.
- Let users disable a texture without deleting it.
- Preserve uploaded textures inside saved presets where feasible, probably as data URLs for local-only presets.

### Texture Sampling

Initial sampling modes:

- Uniform: each enabled texture has equal probability.
- Weighted categorical: each enabled texture has a user-defined weight.

The "multinomial" idea is directionally right, but in UI terms it is probably clearer as weighted texture probabilities. Internally, each particle samples from a categorical distribution over textures. Over many particles, the observed counts follow a multinomial distribution.

Potential later additions:

- Sequence or alternating modes.
- Depth-based texture choice.
- Size-based texture choice.
- Color group or tag based filtering.

## Distribution System

### Core Concept

Each particle parameter should be controlled by a distribution object rather than a hard-coded variance field.

Example parameter config:

```js
{
  parameter: "scale",
  distribution: "logNormal",
  params: {
    median: 1,
    sigma: 0.35
  },
  clamp: {
    min: 0,
    max: 5
  }
}
```

### Initial Distributions

- Constant: fixed value.
- Uniform: min/max.
- Normal: mean/stddev, with optional clamp.
- Log-normal: useful for size and mass.
- Triangular: min/mode/max, useful for artist-friendly biased ranges.
- Exponential: useful for depth, distance, and fading effects.
- Categorical: useful for blend mode, texture, or discrete choices.

Nice-to-have distributions:

- Beta: bounded normalized random values.
- Mixture: combine several distributions with weights.
- Noise curve: sample from a user-drawn or preset curve.

### Parameters To Support

Position:

- X, Y, Z.
- Radial distance.
- Angle.
- Cylindrical radius/angle/height.
- Spherical radius/azimuth/elevation.

Size & rotation:

- Scale.
- Width/height scale, if non-uniform scaling is added.
- XY rotation.
- Optional 3D rotation metadata for future rendering.

Color & blending:

- Alpha.
- Exposure/brightness.
- Saturation.
- Hue rotation.
- Blend mode.

Physical/modifier inputs:

- Mass.
- Density.
- Force influence.

### UI Pattern

For each parameter:

- Enable/disable toggle.
- Distribution selector.
- Distribution-specific controls.
- Clamp controls where relevant.
- Optional link/correlation controls for related values.

Avoid overwhelming the first version by exposing advanced distribution details progressively. The default state should still feel like "spread these sprites around a center point."

## Position Modes

### Cartesian

The default mode. Good for rectangular fields, screen-space scattering, and backward compatibility.

Controls:

- Center X/Y/Z.
- Distribution for X/Y/Z offsets.
- Optional grid snap.

### Radial 2D

Useful for bursts, halos, rings, shockwaves, and circular particle layouts.

Controls:

- Center X/Y.
- Radius distribution.
- Angle distribution.
- Optional Z distribution.

### Cylindrical

Useful for columns, tunnels, vortexes, and vertical shafts.

Controls:

- Center X/Y/Z.
- Radius distribution.
- Angle distribution.
- Height/Z distribution.
- Axis selection or rotation, later.

### Spherical

Useful for explosions, star fields, or volumetric clusters.

Controls:

- Center X/Y/Z.
- Radius distribution.
- Azimuth distribution.
- Elevation distribution.
- Optional hemisphere mode.

Implementation note: keep all modes producing a normalized particle object with Cartesian `x`, `y`, and `z` before rendering.

## Camera & Depth Rendering

### Camera Controls

- Camera distance / Z.
- Vanishing point X/Y.
- Focal depth.
- View factor / field of view equivalent.
- Optional fit-to-canvas reset.

### Fog

Replace contrast-only fog with color fog.

Controls:

- Fog enabled.
- Fog color.
- Fog start.
- Fog end or density.
- Fog blend mode, likely normal alpha blend for version one.

Rendering model:

- Calculate fog amount per sprite from depth.
- Draw sprite normally into an intermediate pass or directly if simple.
- Composite fog color over the sprite according to fog amount.

### Field Blur

Current CSS blur is convenient but has limited depth-of-field character. A circular-kernel blur is a good improvement, especially for bright particles.

Version options:

- Keep CSS blur as the fast default.
- Add "disc blur" quality mode using an offscreen canvas convolution or multi-sample accumulation.
- Cache blurred texture variants by texture, blur radius, and color filter state to avoid recomputing per sprite.

Quality/performance tradeoff:

- Small particle counts can use higher quality.
- Large particle counts should quantize blur radius into buckets.
- Preview may use fast mode while export uses quality mode.

## Forces & Modifiers

Keep forces as a secondary system that transforms particles after initial distribution sampling.

Initial modifiers:

- Gravity/directional offset, preserving the current idea.
- Grid snap.
- Alpha by mass/depth.
- Size by depth or distance.

Later forces:

- Attractor point.
- Repeller point.
- Vortex/tangential force.
- Noise/turbulence displacement.
- Falloff curves: linear, inverse square, smoothstep.

Forces should be deterministic and stateless for still-image output. Avoid time integration until animation becomes a goal.

## Preview UX

### Required Improvements

- Resizable control panel.
- Preview pan and zoom independent from the generated camera.
- Fit to screen, 100%, and center controls.
- Background swatches for transparent, black, white, and custom color.
- Render status for expensive updates.
- Debounced rendering while dragging high-cost controls.

Important distinction: viewport zoom/pan is for inspecting the canvas; camera distance/view factor changes the generated image.

### Helpful Additions

- Before/after or last render comparison.
- Toggle checkerboard.
- Toggle bounds/guides: vanishing point, center point, focal plane indicator where feasible.
- Estimated particle count/performance warning for expensive settings.

## Presets & Project State

The revamped app should support saving/loading the full generator state.

Preset contents:

- App schema version.
- Canvas settings.
- Seed.
- Texture library metadata and embedded custom assets where possible.
- Distribution configs.
- Camera/depth settings.
- Force configs.
- Preview settings if useful.

Preset types:

- Built-in presets for common looks.
- User presets stored in local storage.
- Import/export JSON file.

Schema versioning matters because the distribution model will evolve.

## Architecture Direction

Separate the app into clear layers:

- `generator`: seeded RNG, distribution sampling, position modes, forces, and sprite data creation.
- `renderer`: canvas drawing, projection, sorting, fog, blur, image cache, export.
- `integrations`: Photopea now, Photoshop later.
- `ui`: Svelte controls and panels.
- `presets`: serialization, migration, local storage.

Suggested core data flow:

1. UI edits a serializable project config.
2. Generator samples particles from config and seed.
3. Renderer renders particles using camera/render settings.
4. Export layer returns PNG or sends it to host integration.

This separation should make a Photoshop build much easier because the creative model and renderer are not tied to Photopea messaging.

## Compatibility & Migration

The existing controls can map into the new model:

- `dupCount` -> particle count, plus optionally include or exclude anchor particle.
- `baseX/baseY/baseZ` -> position center.
- `xVariance/yVariance/zVariance` -> uniform distributions around center.
- `baseScale + sizeVariance` -> scale distribution.
- `baseAlpha + alphaVariance` -> alpha distribution.
- `hueVariance/saturationVariance/exposureVariance` -> color distributions.
- `textureURLs` -> texture library with uniform weights.
- `gravityAmount/gravityXyAngle/gravityFading` -> directional force modifier.

If loading old configs is ever supported, migrate them into equivalent distribution configs.

## Proposed Milestones

### Milestone 1: Refactor Without Major UX Change

- Extract generator logic from `+page.svelte`.
- Extract renderer logic from `+page.svelte`.
- Preserve current UI and behavior.
- Add basic tests for deterministic particle generation.

### Milestone 2: Texture Library

- Replace texture selects with a thumbnail library.
- Add upload, remove, reorder, enable/disable, and weights.
- Implement weighted categorical texture sampling.
- Preserve Photopea smart object import.

### Milestone 3: Distribution Parameters

- Introduce distribution config model.
- Implement constant, uniform, normal, log-normal, triangular, and categorical.
- Convert current variance controls to the new model.
- Reorganize UI sections around Position, Size & Rotation, Color & Blending.

### Milestone 4: Preview & Workspace UX

- Resizable panel.
- Viewport pan/zoom.
- Fit/100%/center controls.
- Better render debouncing and render status.

### Milestone 5: Camera & Depth Upgrade

- Add fog color with depth falloff.
- Add improved field blur mode.
- Add render quality setting for preview vs export.

### Milestone 6: Advanced Position Modes

- Add radial 2D mode.
- Add cylindrical mode.
- Add spherical mode.
- Add visual guides where useful.

### Milestone 7: Presets

- Save/load project state.
- Built-in presets.
- Import/export preset JSON.
- Schema migrations.

### Milestone 8: Advanced Forces

- Add attractor and repeller modifiers.
- Add vortex/noise modifiers if performance allows.
- Add falloff controls.

## Open Questions

- Should the base/anchor particle still exist as an optional concept, or should all particles be sampled uniformly from the same model?
- Should texture uploads persist only in the current browser, or should preset export embed them?
- Should the renderer remain pure 2D canvas, or should a WebGL renderer be considered for high particle counts and better blur?
- What is the target maximum particle count for interactive preview?
- Should Photopea export create a new document/layer as it does now, or should it support inserting into the active document at canvas-aligned coordinates?
- Should Photoshop support be a web-based UXP panel, a generator script, or a separate export format first?

## Additional Ideas

- Add a randomize button per section, plus lock toggles for parameters the user wants to preserve.
- Add named seeds or seed history so users can compare variants.
- Add symmetry/mirroring modifiers for graphic design effects.
- Add masks: constrain particles to an imported alpha mask or active Photopea layer mask.
- Add color sampling from an image or gradient map.
- Add blend previews for common particle looks: sparks, fog, bokeh, debris, energy, rain, snow, stars.
- Add export scale multiplier for quick 2x/4x output.
- Add transparent-margin trimming option on export.
- Add batch variant export by seed range.
- Add keyboard shortcuts only after the main preview interactions are stable.

## Recommended First Implementation Path

Start by refactoring the current single-file implementation into generator and renderer modules while preserving behavior. Then build the texture library and distribution model on top of those modules. This reduces risk because the existing app can keep working while the creative model is replaced piece by piece.

The most valuable early user-facing change is probably texture weighting plus preview pan/zoom. The most valuable architectural change is making particle generation a pure function of config and seed.
