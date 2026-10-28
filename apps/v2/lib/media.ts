/**
 * The Blob store is private, so its URLs can't be shown in a browser. Media is
 * served through `/media/<pathname>` instead (app/media/[...path]/route.ts),
 * which reads the blob with the server token.
 */
export function mediaPath(pathname: string): string {
  return `/media/${pathname.split("/").map(encodeURIComponent).join("/")}`;
}
