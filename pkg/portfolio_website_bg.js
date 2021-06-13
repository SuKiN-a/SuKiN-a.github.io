import * as wasm from './portfolio_website_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_22(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1614e12f2c69d4b6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_25(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1614e12f2c69d4b6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1614e12f2c69d4b6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_31(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1614e12f2c69d4b6(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_34(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3296fa8eaac32e9d(arg0, arg1);
}

/**
*/
export function start() {
    wasm.start();
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export function __wbindgen_number_new(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

export function __wbg_instanceof_Window_11e25482011fc506(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export function __wbg_document_5aff8cd83ef968f5(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_innerWidth_8c5001da2fdd6a9e() { return handleError(function (arg0) {
    var ret = getObject(arg0).innerWidth;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_innerHeight_03d3f1d9eb5f7034() { return handleError(function (arg0) {
    var ret = getObject(arg0).innerHeight;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_devicePixelRatio_d92cc4c40f432496(arg0) {
    var ret = getObject(arg0).devicePixelRatio;
    return ret;
};

export function __wbg_requestAnimationFrame_1fb079d39e1b8a26() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_getElementById_b180ea4ada06a837(arg0, arg1, arg2) {
    var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_altKey_5136125f8a64c2cf(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};

export function __wbg_ctrlKey_8fa508d0b540bc8f(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};

export function __wbg_shiftKey_21477313df4f5291(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};

export function __wbg_metaKey_d60075e40f8f06d7(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};

export function __wbg_location_77f65b69069b2f15(arg0) {
    var ret = getObject(arg0).location;
    return ret;
};

export function __wbg_repeat_35fcce34cf544d49(arg0) {
    var ret = getObject(arg0).repeat;
    return ret;
};

export function __wbg_isComposing_615e6dcf813b18db(arg0) {
    var ret = getObject(arg0).isComposing;
    return ret;
};

export function __wbg_key_6827d862c9cc3928(arg0, arg1) {
    var ret = getObject(arg1).key;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_code_4b7138c233a8745f(arg0, arg1) {
    var ret = getObject(arg1).code;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_getModifierState_0d4f9bba8cd43923(arg0, arg1, arg2) {
    var ret = getObject(arg0).getModifierState(getStringFromWasm0(arg1, arg2));
    return ret;
};

export function __wbg_instanceof_HtmlCanvasElement_fd3cbbe3906d7792(arg0) {
    var ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
};

export function __wbg_setwidth_f3c88eb520ba8d47(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
};

export function __wbg_setheight_5a1abba41e35c42a(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
};

export function __wbg_getContext_813df131fcbd6e91() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_preventDefault_7c4d18eb2bb1a26a(arg0) {
    getObject(arg0).preventDefault();
};

export function __wbg_setProperty_dccccce3a52c26db() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_addEventListener_936431894dca4639() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
}, arguments) };

export function __wbg_width_333f7e8d784a56a8(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

export function __wbg_deltaX_d726e0224b540206(arg0) {
    var ret = getObject(arg0).deltaX;
    return ret;
};

export function __wbg_deltaY_7374d71292d30408(arg0) {
    var ret = getObject(arg0).deltaY;
    return ret;
};

export function __wbg_deltaMode_01cad379615c05f4(arg0) {
    var ret = getObject(arg0).deltaMode;
    return ret;
};

export function __wbg_log_9a99fb1af846153b(arg0) {
    console.log(getObject(arg0));
};

export function __wbg_settitle_2359723f49b6cd01(arg0, arg1, arg2) {
    getObject(arg0).title = getStringFromWasm0(arg1, arg2);
};

export function __wbg_style_25309daade79abb3(arg0) {
    var ret = getObject(arg0).style;
    return addHeapObject(ret);
};

export function __wbg_offsetWidth_7dd96a3df070d552(arg0) {
    var ret = getObject(arg0).offsetWidth;
    return ret;
};

export function __wbg_offsetHeight_fe07e4498698e768(arg0) {
    var ret = getObject(arg0).offsetHeight;
    return ret;
};

export function __wbg_instanceof_CanvasRenderingContext2d_779e79c4121aa91b(arg0) {
    var ret = getObject(arg0) instanceof CanvasRenderingContext2D;
    return ret;
};

export function __wbg_setstrokeStyle_2939ee453716e462(arg0, arg1) {
    getObject(arg0).strokeStyle = getObject(arg1);
};

export function __wbg_setfillStyle_af790b5baf4d3210(arg0, arg1) {
    getObject(arg0).fillStyle = getObject(arg1);
};

export function __wbg_setlineWidth_3e6b1837ae38d099(arg0, arg1) {
    getObject(arg0).lineWidth = arg1;
};

export function __wbg_setlineCap_fb4c12b43013ac98(arg0, arg1, arg2) {
    getObject(arg0).lineCap = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlineJoin_c57073e5f8f1e87d(arg0, arg1, arg2) {
    getObject(arg0).lineJoin = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setmiterLimit_7b1fa4c075a056dc(arg0, arg1) {
    getObject(arg0).miterLimit = arg1;
};

export function __wbg_setlineDashOffset_95c5ae90e29d57db(arg0, arg1) {
    getObject(arg0).lineDashOffset = arg1;
};

export function __wbg_setfont_0ad3a6749ddee168(arg0, arg1, arg2) {
    getObject(arg0).font = getStringFromWasm0(arg1, arg2);
};

export function __wbg_beginPath_2378575e37027ad3(arg0) {
    getObject(arg0).beginPath();
};

export function __wbg_clip_8cd725364c4f6317(arg0, arg1) {
    getObject(arg0).clip(takeObject(arg1));
};

export function __wbg_fill_90a79085d683faf9(arg0, arg1) {
    getObject(arg0).fill(takeObject(arg1));
};

export function __wbg_stroke_c1e0313c58997dcf(arg0) {
    getObject(arg0).stroke();
};

export function __wbg_setLineDash_282d66c979863bf6() { return handleError(function (arg0, arg1) {
    getObject(arg0).setLineDash(getObject(arg1));
}, arguments) };

export function __wbg_bezierCurveTo_17ac462613efaa6c(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
};

export function __wbg_closePath_c3e5ac8d61ec3188(arg0) {
    getObject(arg0).closePath();
};

export function __wbg_lineTo_13bbc57988274391(arg0, arg1, arg2) {
    getObject(arg0).lineTo(arg1, arg2);
};

export function __wbg_moveTo_a7bfe2be52f6286b(arg0, arg1, arg2) {
    getObject(arg0).moveTo(arg1, arg2);
};

export function __wbg_quadraticCurveTo_89e16f7334966998(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).quadraticCurveTo(arg1, arg2, arg3, arg4);
};

export function __wbg_restore_544014131c1efb4a(arg0) {
    getObject(arg0).restore();
};

export function __wbg_save_a36632e08be03836(arg0) {
    getObject(arg0).save();
};

export function __wbg_fillText_ca163c7a12c0c43d() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
}, arguments) };

export function __wbg_measureText_74c9c33b65b27282() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getTransform_1bd888189690fda1() { return handleError(function (arg0) {
    var ret = getObject(arg0).getTransform();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_scale_c13292459a9db1f7() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).scale(arg1, arg2);
}, arguments) };

export function __wbg_transform_ef84ccb6df1e4a45() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).transform(arg1, arg2, arg3, arg4, arg5, arg6);
}, arguments) };

export function __wbg_a_5cd81d0a9d57dfb7(arg0) {
    var ret = getObject(arg0).a;
    return ret;
};

export function __wbg_b_3d0e404fe7a8c6c1(arg0) {
    var ret = getObject(arg0).b;
    return ret;
};

export function __wbg_c_855a68f4f814436a(arg0) {
    var ret = getObject(arg0).c;
    return ret;
};

export function __wbg_d_6740f33796ab0863(arg0) {
    var ret = getObject(arg0).d;
    return ret;
};

export function __wbg_e_584848e640f4f9a5(arg0) {
    var ret = getObject(arg0).e;
    return ret;
};

export function __wbg_f_94a6b1d10218f2d9(arg0) {
    var ret = getObject(arg0).f;
    return ret;
};

export function __wbg_offsetX_48af882734391546(arg0) {
    var ret = getObject(arg0).offsetX;
    return ret;
};

export function __wbg_offsetY_c69b7789fffdd294(arg0) {
    var ret = getObject(arg0).offsetY;
    return ret;
};

export function __wbg_ctrlKey_0b565cc670a6a49b(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};

export function __wbg_shiftKey_257c3f6b1ca35555(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};

export function __wbg_altKey_d11cfe960de1bdcc(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};

export function __wbg_metaKey_a3c6ad6306b6adc3(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};

export function __wbg_button_e27f6f9aa0a0c496(arg0) {
    var ret = getObject(arg0).button;
    return ret;
};

export function __wbg_buttons_9968de39db81ecf2(arg0) {
    var ret = getObject(arg0).buttons;
    return ret;
};

export function __wbg_getModifierState_3a0d2184126fecb1(arg0, arg1, arg2) {
    var ret = getObject(arg0).getModifierState(getStringFromWasm0(arg1, arg2));
    return ret;
};

export function __wbg_now_44a034aa2e1d73dd(arg0) {
    var ret = getObject(arg0).now();
    return ret;
};

export function __wbg_get_800098c980b31ea2() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_ba36642bd901572b() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newnoargs_9fdd8f3961dd1bee(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_self_bb69a836a72ec6e9() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_3304fc4b414c9693() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_e0d21cabc6630763() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_8463719227271676() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_newwithlength_01afcd82ae79bda4(arg0) {
    var ret = new Float64Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_set_73349fc4814e0fc6() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbindgen_number_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_debug_string(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_closure_wrapper941(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 373, __wbg_adapter_22);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper943(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 373, __wbg_adapter_25);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper945(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 373, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper947(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 373, __wbg_adapter_31);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper949(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 373, __wbg_adapter_34);
    return addHeapObject(ret);
};

