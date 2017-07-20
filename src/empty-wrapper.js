/**
 * When the user's config does not provide wrapperPath, we use this.
 */
export default function EmptyWrapper(props) {
  return props.children;
}
