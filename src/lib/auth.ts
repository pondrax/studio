import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"

export const HandleAuth = SvelteKitAuth({
  providers: [
    GitHub
  ],
})