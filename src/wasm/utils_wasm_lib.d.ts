/* tslint:disable */
/* eslint-disable */
export function start(): void;
export function add(a: number, b: number): string;
export function hello(message: string): void;
export function encode_base64(input: Uint8Array): string;
export function decode_base64_to_bytes(base64_string: string): any;
export function binary_string_to_bytes(binary_string: string): Uint8Array | undefined;
export function check_content_and_convert(content: any): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly start: () => void;
  readonly add: (a: number, b: number) => [number, number];
  readonly hello: (a: number, b: number) => void;
  readonly encode_base64: (a: number, b: number) => [number, number];
  readonly decode_base64_to_bytes: (a: number, b: number) => any;
  readonly binary_string_to_bytes: (a: number, b: number) => any;
  readonly check_content_and_convert: (a: any) => any;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_1: WebAssembly.Table;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: WebAssembly.Table;
  readonly closure1660_externref_shim: (a: number, b: number, c: any) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h94e9d0e19d29c5dd: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h01a991790d29a2ec: (a: number, b: number) => void;
  readonly closure1677_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he4b0901b51a50d64: (a: number, b: number) => void;
  readonly closure56823_externref_shim: (a: number, b: number, c: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
