import type { APIRoute } from "astro";
import { experimental_AstroContainer } from "astro/container";
import Hello from "../../components/Hello.astro";

export const GET: APIRoute = async ({ request }) => {
  console.log("Test Container - request.url:", request.url);

  const container = await experimental_AstroContainer.create();

  const response = await container.renderToResponse(Hello, {
    props: { message: "Hello via /api/test-container" },
  });

  return response;
};
