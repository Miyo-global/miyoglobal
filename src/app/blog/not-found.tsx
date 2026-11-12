// Title comes from each route's generateMetadata (notFoundMetadata); segment not-found files cannot set it.
import { NotFoundView } from "@/components/not-found-view";

export default function BlogNotFound() {
  return <NotFoundView />;
}
