const debounce = (func, delay=600, ) => {
    let timerID;
    return (args) => {
        if (timerID){
            clearInterval(timerID)
        }
        timerID = setTimeout(()=>{
            func(args);
        }, delay);
    }
}