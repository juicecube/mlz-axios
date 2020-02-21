export function getAjaxRequest():Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => resolve(jasmine.Ajax.requests.mostRecent()), 5000);
  });
}
