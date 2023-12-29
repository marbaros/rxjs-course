import { Observable } from "rxjs";

export function createHttpObservable<T>(url: string): Observable<T> {
  return new Observable((observer) => {
    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    fetch(url, {
      signal: abortSignal,
    })
      .then((response) => {
        return response.json();
      })
      .then((body: T) => {
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    // Rückgabe einer Teardown-Funktion, die beim Unsubscribe aufgerufen wird
    return () => {
      abortController.abort();
    };
  });
}
