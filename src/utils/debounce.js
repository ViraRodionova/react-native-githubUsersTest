export function debounce(func, wait, immediate) {
    let timeout;

    return () => {
        function later() {
            timeout = null;
            if (!immediate) func(arguments);
        }

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func(arguments);
    };
}

export class DebounceClass {
    constructor() {
        this.blocked = false;
    }

    delay = (func, delay = 500) => {
        return () => {
            if (!this.blocked) {
                this.blocked = true;

                if (func) func();

                setTimeout(() => this.blocked = false, delay);
            }
        };
    }
}

export const debounceLast = new DebounceClass();
