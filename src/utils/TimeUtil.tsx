export const localNow = () => {

    // Get the current date and time adjusted for local timezone
    return new Date(new Date().setMinutes(
        new Date().getMinutes() - new Date().getTimezoneOffset()
    ));
};