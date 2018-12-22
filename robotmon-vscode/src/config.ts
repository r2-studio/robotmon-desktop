

export class Config {

  private static config = new Config();
  static getConfig() {
    return Config.config;
  }

  public syncScreenImageQuality: number = 90;
  public syncScreenImageSizeRatio: number = 0.75;

  constructor() {
  }

}