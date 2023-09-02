export class Utils {
  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // mergeSpaces merge multiple spaces to one sapce
  public static mergeSpaces(line: string): string[] {
    return line.replace(/\s\s+/g, ' ').replace('\r', '').split(' ');
  }

  private static parseIfconfigLineMac(line: string): string {
    let startPos = line.indexOf('HWaddr ');
    if (startPos === -1) {
      return '';
    }
    startPos += 7;
    const ip = line.substr(startPos, 17);
    return ip;
  }

  private static parseIfconfigLineIp(line: string): string {
    let startPos = line.indexOf('inet addr:');
    if (startPos === -1) {
      return '';
    }
    startPos += 10;
    const endPos = line.indexOf(' ', startPos);
    const ip = line.substring(startPos, endPos);
    return ip;
  }

  public static parseIfconfigIPMACs(text: string): { ip: string; mac: string }[] {
    const ips: { ip: string; mac: string }[] = [];
    const lines = text.split('\n');
    let tmpMac = '';
    for (const line of lines) {
      const mac = Utils.parseIfconfigLineMac(line);
      const ip = Utils.parseIfconfigLineIp(line);
      if (mac !== '') {
        tmpMac = mac;
      }
      if (tmpMac !== '' && ip !== '') {
        ips.push({ ip, mac: tmpMac });
      }
    }
    return ips;
  }

  public static parseNetcfg(text: string): { ip: string; mac: string }[] {
    const ips: { ip: string; mac: string }[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
      const tabs = Utils.mergeSpaces(line);
      if (tabs.length >= 5) {
        const ip = tabs[2].substr(0, tabs[2].indexOf('/'));
        const mac = tabs[4].trim();
        ips.push({ ip, mac });
      }
    }
    return ips;
  }

  public static clipString(text: string, lstr: string, rstr: string): string {
    let lp = text.indexOf(lstr);
    if (lp === -1) {
      return '';
    }
    lp += lstr.length;
    if (rstr != '') {
      const rp = text.indexOf(rstr, lp);
      if (rp === -1) {
        return '';
      }
      return text.substring(lp, rp);
    }
    return text.substring(lp);
  }
}
