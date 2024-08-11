import MillionLint from "@million/lint";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import million from "million/compiler";
import createNextIntlPlugin from "next-intl/plugin";
import remarkGfm from "remark-gfm";

await import("./src/env.js");

// Everything starts here. This is the main Next.js configuration file.
// The Reliverse Next Config comes with minimal and recommended configurations.
// Run `pnpm reli:setup` to easily switch between them and set up other
// tools. If you want to try all new Next.js features and
// Million.js, choose the recommended configuration.
// P.S. The *.mjs extension is not needed anymore
// because the package.json type module is used.

const millionEnabled = false; // unstable

// Uncomment the following lines to enable the Vercel Toolbar (and <Reliverse /> component in RootLocaleLayout)
// import withVercelToolbar from "@vercel/toolbar/plugins/next";

// The whitelist list of domains that are allowed to show media content
const hostnames = [
  "*.githubusercontent.com",
  "*.googleusercontent.com",
  "api.dicebear.com",
  "cdn.discordapp.com",
  "discordapp.com",
  "githubusercontent.com",
  "googleusercontent.com",
  "i.imgur.com",
  "images.unsplash.com",
  "img.youtube.com",
  "pbs.twimg.com",
  "res.cloudinary.com",
  "utfs.io",
  "www.gravatar.com",
  "img.clerk.com",
  "images.clerk.com",
];

// Everything starts here, this is the main Next.js configuration file
// @see https://nextjs.org/docs/app/building-the-application/configuring
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  experimental: {
    // React Compiler currently uses Webpack/Babel
    // only, so it may slightly slow down the build
    // reactCompiler: false,
    // after: true,
    mdxRs: true,
    optimisticClientCache: true,
    optimizePackageImports: [
      "recharts",
      "lucide-react",
      "@radix-ui/react-icons",
      "@radix-ui/react-avatar",
      "@radix-ui/react-select",
      "date-fns",
    ],
    optimizeServerReact: true,
    ppr: false, // true - supported by next@canary only
    // uncomment if you use superjson in 'browser' context
    // swcPlugins: [
    //   [
    //     "next-superjson-plugin",
    //     {
    //       excluded: [],
    //     },
    //   ],
    // ],
    serverMinification: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: hostnames.map((hostname) => ({
      hostname,
      protocol: "https",
    })),
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  // Adobe React Spectrum (next dev --turbo is not supported)
  // transpilePackages: [
  //   "@adobe/react-spectrum",
  //   "@react-spectrum/*",
  //   "@spectrum-icons/*",
  // ].flatMap((spec) => glob.sync(spec, { cwd: "node_modules/" })),
};

// Create a config wrapper required to integrate a modern Next.js MDX support
// @see https://nextjs.org/docs/app/building-the-application/configuring/mdx
const withMDX = createMDX({
  // extension: /\.mdx?$/,
  options: {
    // providerImportSource: "@mdx-js/react",
    rehypePlugins: [],
    remarkPlugins: [remarkGfm],
  },
});

// Create a configuration wrapper required to change the default next-intl config location
// @see https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing
const withIntl = createNextIntlPlugin("./src/i18n.ts");

// Next.js Bundle Analyzer helps you manage the size of the JavaScript modules
// @see https://nextjs.org/docs/app/building-the-application/optimizing/bundle-analyzer
const withAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line no-restricted-properties
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const chainedNextConfig = withAnalyzer(withIntl(withMDX(nextConfig)));

const reliverseConfig = million.next(
  MillionLint.next({
    // Million Lint Configuration
    // @see https://million.dev
    rsc: true,
  })(chainedNextConfig),
  {
    // Million.js Compiler Configuration
    auto: {
      rsc: true,
    },
    rsc: true,
  },
);

// const reliverseConfigWithVercelToolbar = withVercelToolbar()(reliverseConfig);

// export default process.env.ENABLE_VERCEL_TOOLBAR
// ? reliverseConfigWithVercelToolbar
// : reliverseConfig;

export default millionEnabled ? reliverseConfig : chainedNextConfig;
