import Wrapped from "./Wrapped";
import { TikTokUserData, TikTokUserDataSchema } from "./types";
import JSZip from "jszip";

export default class WrappedCreator {
  fromFile(file: File): Promise<Wrapped> {
    return new Promise((resolve, reject) => {
      if (file.type === "application/zip") {
        this.fromZip(file).then(resolve).catch(reject);
      } else {
        this.fromJSON(file).then(resolve).catch(reject);
      }
    });
  }

  private fromJSON(file: File): Promise<Wrapped> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = JSON.parse(e.target.result as string);
          const userData = content as TikTokUserData;
          resolve(new Wrapped(userData));
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.readAsText(file);
    });
  }

  private async fromZip(file: File): Promise<Wrapped> {
    const zip = new JSZip();
    await zip.loadAsync(file);
    const jsonFile = Object.values(zip.files)[0];
    const jsonContent = await jsonFile.async("string");
    const content = JSON.parse(jsonContent as string);
    const userData = content as TikTokUserData;
    return new Wrapped(userData);
  }

  forDemoMode(): Wrapped {
    const wrapped = new Wrapped({} as any);
    wrapped.demoMode = true;
    return wrapped;
  }
}
