/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module "*.json" {
  const value: any;
  export default value;
}

declare var System: System;
interface System {
  import(request: string): Promise<any>;
}

/** 
 * HACK: declare unknown type for Raven to 
 * allow Typescript 2 to compile. 
 * Remove when upgrading to Typescript 3
 */
type unknown = any;