import {useEffect, useRef, useState} from "react";

//异步任务，同步状态和数据！三个状态loading success error
export function useAsyncTask(promiseConstructor, options = {}) {
    const [state, setState] = useState(options.init || {});
    // 防止组件卸载以后，异步回调再修改状态
    const unmounted = useRef(false);
    // 防止重复执行出现混乱，如果上次执行还没有完成，又重新执行，则上次执行返回的结果会被丢弃
    const lastCallId = useRef(0);
    const execute = (...args)=> {
        if (unmounted.current)
            return;

        const callId = ++lastCallId.current;
        setState(prevState => ({ ...prevState, status: "loading" }));
        options.onLoading && options.onLoading();
        let promiseCall = promiseConstructor;
        if (typeof promiseConstructor !== "function") {
            if (!args || args.length === 0)
                throw new Error("The first argument should be a promiseConstructor name");

            promiseCall = promiseConstructor[args.splice(0, 1)[0]];
        }

        promiseCall(...args).then(data => {
            if (unmounted.current || callId !== lastCallId.current)
                return;
            setState(prevState => ({ ...prevState, status: "success", data }));
            options.onSuccess && options.onSuccess(data);
        }).catch(error=> {
            if (unmounted.current || callId !== lastCallId.current)
                return;

            setState(prevState => ({...prevState, status: "error", error}));
            options.onError && options.onError(error);
        });
    };

    const setData = data => {
        setState(prevState => ({
            ...prevState,
            data: typeof data === "function" ? data(prevState.data) : data
        }));
    }

    useEffect(() => () => {
        unmounted.current = true;
    }, []);

    return {...state, execute, setData};
}