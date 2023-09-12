export function addDataToLocalStorage(key:string,value:any) {
    return window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadDataFromLocalStorage(key:string) {
    return window.localStorage.getItem(key)
}