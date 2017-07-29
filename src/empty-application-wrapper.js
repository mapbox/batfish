/**
 * When the user's config does not provide applicationWrapperPath, we use this.
 */
export default function EmptyApplicationWrapper(props) {
  return props.children;
}
