import type {Container} from './Container';

export type Class = new (...args: any) => any;

export type DesignPatern = 'factory' | 'singleton';

export type JectionModule = (container: Container) => void;
