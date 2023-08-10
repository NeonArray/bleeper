/**
 * @param response
 * @param message
 */
export function interrogateError(
    response: { [key: string]: unknown } | void,
    message: string,
): void {
    if (response && "error" in response) {
        console.error(`${message}, reason: ${JSON.stringify(response.error)}`);
    }
}
