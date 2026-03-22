import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>react-formsteps</span>,
  project: {
    link: 'https://github.com/franklinjunior23/react-formsteps',
  },
  docsRepositoryBase: 'https://github.com/franklinjunior23/react-formsteps',
  footer: {
    text: 'react-formsteps © 2025 Franxx',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Headless multi-step form library for React" />
      <title>react-formsteps docs</title>
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – react-formsteps',
    };
  },
};

export default config;
