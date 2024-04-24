import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import remarkCorepass from "remark-corepass";
import remarkCorebc from "remark-corebc";
import remarkCurrencyFormatter from 'remark-currency-formatter';
import remarkFediverseUser from "remark-fediverse-user";
import math from "remark-math";
import katex from "rehype-katex";

import versions from "./versions.json";

const isDev = process.env.NODE_ENV === "development";
const isVersioningDisabled = !!process.env.DISABLE_VERSIONING;
const isBuildFast = !!process.env.BUILD_FAST;
const isCloudflarePages = !!process.env.CF_PAGES;
const isDeployPreview =
  isCloudflarePages && !!process.env.CF_PAGES_PULL_REQUEST;
const isBranchDeploy =
  isCloudflarePages && process.env.CF_PAGES_BRANCH !== "master";
const baseUrl = process.env.BASE_URL ?? "/";

function isPrerelease(version: string) {
  return (
    version.includes("alpha") ||
    version.includes("beta") ||
    version.includes("rc")
  );
}

function getLastVersion() {
  const firstStableVersion = versions.find((version) => !isPrerelease(version));
  return firstStableVersion ?? versions[0];
}

function getNextVersionName() {
  return "Canary";
}

const config: Config = {
  title: "Core Developer Hub",
  tagline: "Core Developer Hub",
  favicon: "img/favicon.ico",
  url: "https://dev.coreblockchain.net",

  baseUrl,
  organizationName: "core-coin",
  projectName: "core-dev",

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: ({ versionDocsDirPath, docPath }) => {
            return `https://github.com/core-coin/core-dev/edit/master/${versionDocsDirPath}/${docPath}`;
          },
          routeBasePath: "/",
          path: "docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          disableVersioning: isVersioningDisabled,

          lastVersion:
            isDev ||
            isVersioningDisabled ||
            isDeployPreview ||
            isBranchDeploy ||
            isBuildFast
              ? "current"
              : getLastVersion(),
          onlyIncludeVersions: (() => {
            if (isBuildFast) {
              return ["current"];
            } else if (
              !isVersioningDisabled &&
              (isDev || isDeployPreview || isBranchDeploy)
            ) {
              return ["current", ...versions.slice(0, 2)];
            }
            return undefined;
          })(),
          versions: {
            current: {
              label: `${getNextVersionName()} 🚧`,
            },
            ...versions.reduce((acc, version) => {
              if (isPrerelease(version)) {
                return {
                  ...acc,
                  [version]: {
                    label: `CORE v. ${version}`,
                  },
                };
              }
              return {
                ...acc,
                [version]: {
                  label: `CORE v. ${version}`,
                },
              };
            }, {}),
          },
          remarkPlugins: [
            math,
            remarkCorepass,
            remarkCorebc,
            remarkCurrencyFormatter,
            remarkFediverseUser,
          ],
          rehypePlugins: [
            [
              katex,
              {
                output: 'mathml',
                strict: 'newLineInDisplayMode',
              },
            ],
          ],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "manifest",
        href: "/manifest.json",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "generator",
        content: "CoreWeb Generator",
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Organization',
        name: 'CORE FOUNDATION',
        url: 'https://coreblockchain.net',
        logo: 'https://dev.coreblockchain.net/img/logo.svg',
      }),
    },
  ],

  themeConfig: {
    image: "img/social-card.png",
    metadata: [
      {
        name: "description",
        content:
          "A Core Developer portal providing documentation and information for the Core Blockchain and it's ecosystem.",
      },
      { property: "og:title", content: "Core Developer Hub" },
      {
        property: "og:description",
        content:
          "A Core Developer portal providing documentation and information for the Core Blockchain and it's ecosystem.",
      },
      { property: "og:type", content: "website" },
      {
        name: "keywords",
        content:
          "core, blockchain, core blockchain, core coin, corecoin, core dev, core developer, core developer hub, core dev hub, core developer portal, core dev portal, core developer documentation, core dev docs, core developer docs, core developer information, core dev information, core developer info, core dev info, core developer resources, core hub",
      },
      { property: 'ican:xcb', content: 'cb57bbbb54cdf60fa666fd741be78f794d4608d67109' },
      { name: "theme-color", content: "#3b9a3e"},
      { name: "apple-mobile-web-app-capable", content: "yes"},
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent"},
    ],
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Core Dev Hub",
      logo: {
        alt: "Core",
        src: "img/logo.png",
      },
      items: [
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              type: "html",
              value: '<hr class="dropdown-separator">',
            },
            {
              to: "/versions",
              label: "All versions",
            },
          ],
        },
        {
          href: "https://github.com/core-coin",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Core",
        src: "img/logo.png",
      },
      links: [
        {
          title: "Ecosystem",
          items: [
            {
              label: "CoreBC Homepage",
              href: "https://coreblockchain.net",
            },
            {
              label: "Blockindex",
              href: "https://blockindex.net",
            },
            {
              label: "Payto Money",
              href: "https://payto.money",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Blog",
              href: "https://blog.coreblockchain.net",
            },
            {
              label: "CIP",
              href: "https://cip.coreblockchain.net",
            },
            {
              label: "Booster",
              href: "https://coreblockchain.net#booster",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "X",
              href: "https://x.com/corecoincc",
            },
            {
              label: "GitHub",
              href: "https://github.com/core-coin",
            },
            {
              label: "Discord",
              href: "https://discord.gg/SCxmFr5Pwp",
            },
            {
              label: "Core◆Talk",
              href: "https://coretalk.space/@coreblockchain",
            },
          ],
        },
      ],
      copyright: `License CC⓪ 2016-${new Date().getFullYear()} CORE FOUNDATION.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    securityEmail: {
      email: "security-coreblockchain.net@onion.email",
      keyId: "E13007A2",
      keyLink: "https://github.com/core-coin/keys/blob/master/Security%20(E13007A2).asc",
    },
    aliases: {
      go: {
        name: "Go-Core",
        project: "go-core",
      },
      ru: {
        name: "Core Rust",
        project: "core",
      },
    },
  },
} satisfies Config;

export default config;
