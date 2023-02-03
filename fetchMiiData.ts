import * as path from "https://deno.land/std@0.171.0/path/mod.ts";

import * as mii from "https://raw.githubusercontent.com/brecert/mii/mii/mod.ts";
import { Asset } from "https://raw.githubusercontent.com/brecert/mii/mii/formats/mii_studio/asset.ts";
import { MiiStudio } from "https://raw.githubusercontent.com/brecert/mii/mii/formats/mod.ts";

import data from "./example.mii.json" assert { type: "json" };
import { toCSSVars } from "./genMiiData.ts";

type MiiPartName =
  | "body"
  | "face"
  | "hair"
  | "eye"
  | "eyebrow"
  | "nose"
  | "mouth"
  | "beard"
  | "mustache"
  | "glasses"
  | "mole";

type MiiAssets = Record<MiiPartName, Asset>;

function assetsFromMii(mii: MiiStudio.MiiData): MiiAssets {
  return {
    body: Asset.fromBody({
      color: mii.favoriteColor,
      gender: mii.miiGender,
    }),
    face: Asset.fromFace({
      shape: mii.faceShapeType,
      color: mii.faceColor,
      features: mii.faceMakeupType,
      wrinkles: mii.faceWrinklesType,
    }),
    hair: Asset.fromHair({
      type: mii.hairType,
      color: mii.hairColor,
      faceType: mii.faceShapeType,
      flipped: mii.hairFlipped,
      favoriteColor: mii.favoriteColor,
    }),
    eye: Asset.fromEye({
      type: mii.eyeType,
      color: mii.eyeColor,
    }),
    eyebrow: Asset.fromEyebrow({
      type: mii.eyebrowType,
      color: mii.eyebrowColor,
    }),
    nose: Asset.fromNose({
      type: mii.noseType,
      color: mii.faceColor,
    }),
    mouth: Asset.fromMouth({
      type: mii.mouthType,
      color: mii.mouthColor,
    }),
    beard: Asset.fromBeard({
      type: mii.beardType,
      faceType: mii.faceShapeType,
      color: mii.hairColor,
    }),
    mustache: Asset.fromMustache({
      type: mii.mustacheType,
      color: mii.hairColor,
    }),
    glasses: Asset.fromGlasses({
      type: mii.glassesType,
      color: mii.glassesColor,
    }),
    mole: Asset.fromMole({
      enabled: mii.moleEnabled,
    }),
  };
}

const miiData = mii.format.convert.fromMiitool(data.core);
const assets = assetsFromMii(miiData);
const downloads = Object.entries(assets).map(async ([name, asset]) => {
  const downloadPath = `./downloads/${asset.getPath()}`;

  try {
    await Deno.mkdir(path.dirname(downloadPath), { recursive: true });
    const file = await Deno.open(downloadPath, {
      createNew: true,
      write: true,
    });
    const res = await fetch(asset.getUrl());
    await res.body?.pipeTo(file.writable);
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
  }

  return [name, asset.getPath()];
});

const assetDownloads = await Promise.all(downloads);
const cssVars = toCSSVars(miiData);

console.log(cssVars);
// console.log(assetDownloads.map((d) => `--asset-${d.name}: url("${d.path}")`).join(';\n'));
console.log(Object.fromEntries(assetDownloads));
