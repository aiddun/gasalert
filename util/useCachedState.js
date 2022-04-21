import {useState, useEffect} from "react"

// Modified from https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/
export function useCachedStateSSR(defaultValue, key, minsTTL) {
  const [value, setValue] = useState(undefined);
  // Because we're using SSR, we have to update state 
  // after the first render as a side-effect. 
  // Because of that, since we're calling setValue once we
  // recieve data from localstorage, we'll trigger the lower      
  // side effect, which is redundant if we just read 
  // from that very same localstorage, resetting the TTL
  // Because React batches state updates (but also keeps
  // their ordering), we can call setValue and then setMounted
  // and then no matter what, on later updates,the lower hook
  // will always know if it's a mounted update, even if it's batched
  const [mounted, setMounted] = useState(false);

  // Perform load check after mount because this site is SSR 
  useEffect(() => {
    const stickyValue = window.localStorage.getItem(key);

    if (stickyValue !== null) {
      const { value, date } = JSON.parse(stickyValue);
      const msDelta = (new Date()) - date;
      const minsDelta = msDelta / 1000 / 60;
      
      if (minsDelta > minsTTL){
        setValue(value)
      } else {
        setValue(defaultValue)
      }
    } else {
      setValue(defaultValue)
    }
    setMounted(true)

  }, [])

  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem(key, JSON.stringify({ value, date: new Date() }));
    }
  }, [key, value]);
  
  return [value, setValue];
}