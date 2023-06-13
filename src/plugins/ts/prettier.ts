class Prettier {
  constructor() {
    return;
  }

  pretty(data: any): string {
    if (!data) throw new TypeError("[TRYN] You must validate json bodied data");
    return JSON.stringify(data, null, 2);
  }
}