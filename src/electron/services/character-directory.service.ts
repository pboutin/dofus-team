import puppeteer, { ElementHandle } from "puppeteer";

import { Class, DirectoryCharacter, Gender, Server } from "../common/types";

export const fetch = async (
  name: string,
  server: Server
): Promise<DirectoryCharacter | null> => {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  const url = `https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos?text=${name}&character_homeserv[]=${server}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const characterRows = await page.$$(".ak-panel-content table tbody tr");

  const characterRow = characterRows.find(async (characterRow) => {
    const characterNameElement = await characterRow.$("td:nth-child(2) a");
    if (!characterNameElement) return false;

    const characterNameText = await characterNameElement.evaluate(
      (element) => element.textContent
    );

    return characterNameText === name;
  });

  if (!characterRow) return null;

  const className = await extract(
    characterRow,
    "td:nth-child(3) a",
    (element) => {
      return element.textContent! as Class;
    }
  );

  const gender = await extract<Gender>(
    characterRow,
    "td:nth-child(5)",
    (element) => {
      if (element.textContent === "Femelle") {
        return "female";
      }
      return "male";
    }
  );

  const avatarUrl = await extract(
    characterRow,
    "td:nth-child(1) div",
    (element) => {
      const backgroundStyle = element.style.background;
      const regex = /(https.+\.png)/;
      const [, url] = regex.exec(backgroundStyle)!;
      return url;
    }
  );

  const result = { name, class: className, server, gender, avatarUrl };
  console.log("Fetched character", result);
  return result;
};

const extract = async <T>(
  characterRow: ElementHandle,
  selector: string,
  evaluate: (element: HTMLElement) => T
) => {
  const element = (await characterRow.$(selector))!;
  const result = await element.evaluate(evaluate);
  return result;
};
