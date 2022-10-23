import {rmSync} from 'fs';
import {resolve, basename} from 'path';
import {defineConfig, RollupOptions, OutputOptions} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import {terser} from 'rollup-plugin-terser';

interface PackageConfig {
  path: string;
  name?: string;
  input?: string;
  external?: RollupOptions['external'];
  globals?: OutputOptions['globals'];
  exports?: OutputOptions['exports'];
}

interface RollupConfig {
  output: string;
  format: 'es' | 'esm' | 'cjs' | 'iife';
  esVersion?: 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
  name?: string;
  minify?: boolean;
  dts?: boolean;
}

export function createConfig(packageConfig: PackageConfig) {
  const getPath = (x: string) => resolve(packageConfig.path, x);

  rmSync(getPath('dist'), {recursive: true, force: true});
  if (!packageConfig.name) packageConfig.name = basename(packageConfig.path);
  if (!packageConfig.input) packageConfig.input = getPath('src/index.ts');

  const rollupConfigs: RollupConfig[] = [
    {
      output: getPath('dist/index.d.ts'),
      format: 'es',
      dts: true
    },
    {
      output: getPath('dist/index.esm-bundler.js'),
      format: 'esm',
      esVersion: 2015
    },
    {
      output: getPath('dist/index.cjs.js'),
      format: 'cjs',
      esVersion: 2015
    },
    {
      output: getPath('dist/index.global.js'),
      format: 'iife',
      name: packageConfig.name.toLowerCase() + 'Jection',
      esVersion: 5
    },
    {
      output: getPath('dist/index.global.min.js'),
      format: 'iife',
      name: packageConfig.name.toLowerCase() + 'Jection',
      esVersion: 5,
      minify: true
    }
  ];

  return defineConfig(
    rollupConfigs.map(rollupConfig =>
      createRollupConfig(packageConfig, rollupConfig)
    )
  );
}

function createRollupConfig(
  packageConfig: PackageConfig,
  rollupConfig: RollupConfig
): RollupOptions {
  const plugins: RollupOptions['plugins'] = [];

  if (rollupConfig.dts === true) {
    plugins.push(dts());
  } else {
    plugins.push(
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
        }
      })
    );

    plugins.push(commonjs());

    plugins.push(
      ts({
        check: false,
        tsconfigOverride: {
          compilerOptions: {
            target: 'es' + rollupConfig.esVersion
          }
        },
        exclude: ['node_modules']
      })
    );

    if (rollupConfig.minify === true) {
      plugins.push(
        terser({
          compress: {
            ecma: rollupConfig.esVersion,
            pure_getters: true
          },
          format: {
            comments: false
          }
        })
      );
    }
  }

  return {
    input: packageConfig.input,
    output: {
      file: rollupConfig.output,
      format: rollupConfig.format,
      name: rollupConfig.name,
      globals: packageConfig.globals,
      exports: packageConfig.exports
    },
    external: packageConfig.external,
    plugins
  };
}
