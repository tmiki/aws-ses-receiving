import { ProjectEnvironment } from './project-environment';
import { NamingUtil } from './naming-util';
import { LookupUtil } from './lookup-util';
import { DebugOutUtil } from './debug-out-util';
import { EnvConfig, EnvConfigKey } from '../envconfig/types';
import { EnvConfigDev } from '../envconfig/env-dev';
import { EnvConfigPrd } from '../envconfig/env-prd';
import { EnvConfigTest } from '../envconfig/env-test';

import { ResourceNameString } from './resource-name-string';

export type AllEnvConfigs = {
  [key: string]: EnvConfig;
};
const allEnvConfigs: AllEnvConfigs = {
  dev: EnvConfigDev,
  prd: EnvConfigPrd,
  test: EnvConfigTest,
};

export class CdkUtil {
  // Make this class Singleton.
  private static instance: CdkUtil;
  public static getInstance(): CdkUtil {
    if (!CdkUtil.instance) {
      CdkUtil.instance = new CdkUtil();
    }
    return CdkUtil.instance;
  }

  // Composition objects.
  e: ProjectEnvironment;
  envConfig: EnvConfig;
  naming: NamingUtil;
  lookup: LookupUtil;
  debugOut: DebugOutUtil;

  // Initialize the object itself.
  constructor() {
    this.e = new ProjectEnvironment();
    this.envConfig = allEnvConfigs[this.e.envName];
    this.naming = new NamingUtil(this.e);
    this.lookup = new LookupUtil(this.e);
    this.debugOut = new DebugOutUtil(this.e);
  }

  // Return an extended string object represents AWS resources.
  public getResourceNameString(name: string) {
    return new ResourceNameString(name, this.e);
  }

  // Retrieve a set of variables in the EnvConfig object.
  public getEnvConfig<K extends keyof EnvConfig>(keyName: K): EnvConfig[K] {
    const value = this.envConfig[keyName];
    if (value === undefined) {
      throw new Error(`No configuration found for keyName: ${String(keyName)} in environment: ${this.e.envName}`);
    }
    return value;
  }
}
