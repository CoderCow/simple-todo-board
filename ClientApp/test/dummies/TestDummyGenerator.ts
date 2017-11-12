export type FactoryFunction = (amount: number) => any[];
type FactoryFunctionDictionary = { [type: string]: FactoryFunction };
type Constructor = { new(): any };

export class TestDummyGenerator {
  private dummyFactories: FactoryFunctionDictionary = {};

  public registerFactory(ctor: Constructor | string, factoryFunction: FactoryFunction): TestDummyGenerator {
    let type = this.ctorToName(ctor);
    this.dummyFactories[type] = factoryFunction;
    return this;
  }

  public single(ctor: Constructor | string, overrides?: {}): any {
    return this.multiple(ctor, 1, overrides)[0];
  }

  public multiple(ctor: Constructor | string, amount: number, overrides?: {}): any {
    let type = this.ctorToName(ctor);
    let factory = this.dummyFactories[type];
    let dummies: any[] = factory(amount);

    if (overrides)
      dummies.forEach(d => Object.assign(d, overrides));

    return dummies;
  }

  private ctorToName(ctor: Constructor | string): string {
    if (typeof ctor === "string")
      return ctor;

    return ctor.name;
  }
}

export function testDummyGenerator() {
  return new TestDummyGenerator();
}
