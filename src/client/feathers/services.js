export function services() {
    const app = this;

    // requests service declaration
    app.service('loans').hooks({
        after(hook) {
        }
    });
}