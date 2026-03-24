import type { PageLoad } from "./$types";
import { getCertificate } from "$lib/api";

export const load: PageLoad = async ({ params, fetch }) => {
  const certificate = await getCertificate(params.id, fetch);

  return {
    certificate
  };
};
