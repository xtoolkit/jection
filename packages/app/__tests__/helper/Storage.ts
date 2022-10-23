export class Storage {
  constructor(private input: any = null) {}

  get(input: any) {
    return {
      local: input,
      storage: this.input
    };
  }
}
