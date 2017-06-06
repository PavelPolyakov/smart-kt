export function services() {
    const app = this;

    // requests service declaration
    app.service('/requests').hooks({
        after(hook) {
        }
    });
}