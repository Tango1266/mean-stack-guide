import {AbstractControl} from '@angular/forms';
import {observable, Observable, Observer, of} from 'rxjs';

// Synch - Validators: returns (errorcode, value) or null if valid
// Asynch - Validators: Promosie or Observable wrapping above
export const mimeType = (
    control: AbstractControl
    // generic type for (key:value) => [key:string]:any
): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if (typeof (control.value) === 'string'){
        return of(null);
    }

    const file = control.value as File;

    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener('loadend', () => {
            // validate mime Type
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;

            // build string with hexa-deximal values
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }

            // check for valid image file types
            switch (header) {
                case '89504e47': isValid = true; break;
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                case 'ffd8ffe3':
                case 'ffd8ffe8': isValid = true; break;
                default:
                    isValid = false; break;
            }

            if (isValid){
                observer.next(null);
            } else {
                observer.next({invalidMimeType: true});
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};
