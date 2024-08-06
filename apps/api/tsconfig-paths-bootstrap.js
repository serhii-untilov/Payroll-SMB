import tsConfig from './tsconfig.json';
import tsConfigPaths from 'tsconfig-paths';

tsConfigPaths.register({
    baseUrl: tsConfig.compilerOptions.outDir,
    paths: tsConfig.compilerOptions.paths,
});
