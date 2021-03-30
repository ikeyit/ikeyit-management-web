import {useCallback, useEffect, useReducer, useRef, useState} from "react";


export function useSafeReducer(reducer, middleware, initializerArg, initializer) {
    const [state, rawDispatch] = useReducer(reducer, initializerArg, initializer);
    const mounted = useRef(true);
    // const safeDispatch = useCallback(action => mounted.current && rawDispatch(action), [rawDispatch]);
    //dispatch wrapper 使在dispatch中还可以调用dispatch
    const dispatch = useCallback(action => middleware(action, action => mounted.current && rawDispatch(action)), [rawDispatch]);
    useEffect(() => () => {
        mounted.current = false;
    }, []);

    return [state, dispatch];
}