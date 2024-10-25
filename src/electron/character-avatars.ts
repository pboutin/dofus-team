import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

import { app, ipcMain } from 'electron';
import { GoToOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import puppeteerPluginStealth from 'puppeteer-extra-plugin-stealth';

puppeteer.use(puppeteerPluginStealth());

const BASE_URL = 'https://www.dofus.com';
const SEARCH_URL = '/fr/mmorpg/communaute/annuaires/pages-persos';
const PUPPETEER_GOTO_OPTIONS: GoToOptions = {
  waitUntil: 'domcontentloaded',
};

export default class CharacterAvatars {
  private storageDirectory: string;
  private subscriptions: Set<(characterName: string, server: string, base64: string) => void> = new Set();

  constructor() {
    this.storageDirectory = `${app.getPath('userData')}/character-avatars`;

    fs.mkdirSync(this.storageDirectory, { recursive: true });

    ipcMain.handle(
      `characterAvatar:fetchBase64`,
      async (_, characterName: string, server: string, forceRefresh: boolean) => {
        if (forceRefresh) {
          this.subscriptions.forEach((callback) => callback(characterName, server, null));
        }

        const fetchedImage = await this.fetchBase64(characterName, server, forceRefresh);
        if (!fetchedImage) return null;
        if (!forceRefresh) return fetchedImage;

        this.subscriptions.forEach((callback) => callback(characterName, server, fetchedImage));
      },
    );
  }

  onChange(callback: (characterName: string, server: string, base64: string) => void) {
    this.subscriptions.add(callback);
    return () => this.subscriptions.delete(callback);
  }

  private async fetchBase64(characterName: string, server: string, forceRefresh = false): Promise<string | null> {
    const imagePath = this.resolveAvatarImagePath(characterName, server);

    if (fs.existsSync(imagePath) && !forceRefresh) {
      return this.readAsBase64(imagePath);
    }

    const browser = await puppeteer.launch({
      headless: true,
    });
    const browserPage = await browser.newPage();
    await browserPage.setViewport({ width: 1080, height: 1024 });

    await browserPage.goto(
      `${BASE_URL}${SEARCH_URL}?${new URLSearchParams({ name: characterName })}`,
      PUPPETEER_GOTO_OPTIONS,
    );

    // Debug
    // browserPage.screenshot({ path: 'character-avatars-debug.png' });

    let characterUrl: string | null = null;
    const characterRowElements = await browserPage.$$('.ak-table tbody tr');
    for (const characterRowElement of characterRowElements) {
      const characterServer = await (
        await characterRowElement.$('td:nth-child(2)')
      ).evaluate((node) => node.textContent);

      if (characterServer !== server) continue;

      characterUrl = await (await characterRowElement.$('a')).evaluate((node) => node.getAttribute('href'));
      break;
    }

    if (!characterUrl) return null;

    await browserPage.goto(`${BASE_URL}${characterUrl}`, PUPPETEER_GOTO_OPTIONS);

    const avatarCssStyle = await (
      await browserPage.$('.ak-directories-header .ak-entitylook')
    ).evaluate((node) => node.getAttribute('style'));

    const avatarUrl = avatarCssStyle.match(/url\((.+)\)/)[1].replace(/\d+_\d+-\d\.png$/, '100_100-0.png');

    const avatarResponse = await fetch(avatarUrl);

    const stream = fs.createWriteStream(imagePath);
    await finished(Readable.fromWeb(avatarResponse.body).pipe(stream));

    return this.readAsBase64(imagePath);
  }

  private readAsBase64(imagePath: string): string {
    return fs.readFileSync(imagePath).toString('base64');
  }

  private resolveAvatarImagePath(characterName: string, server: string): string {
    return `${this.storageDirectory}/${server}-${characterName}.png`;
  }
}
