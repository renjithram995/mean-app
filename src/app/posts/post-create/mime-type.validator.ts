import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any } | null> => {
    if (typeof control.value === 'string') {
        return of(null)
    }
    const file = control.value as File
    const fileReader = new FileReader()
    const frObs = new Observable((observable: Observer<{ [key: string]: any } | null>) => {
        fileReader.addEventListener('loadend', () => {
            const arrayBuffer = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4)
            let header = ''
            let isValid = false;
            for (let i = 0; i < arrayBuffer.length; i++) {
                header += arrayBuffer[i].toString(16)
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false; // Or you can use the blob.type as fallback
                    break;
            }
            if (isValid) {
                observable.next(null)
            } else {
                observable.next({
                    invalidMimeType: true
                })
            }
            observable.complete()
        })
        fileReader.readAsArrayBuffer(file)
    })
    return frObs
}