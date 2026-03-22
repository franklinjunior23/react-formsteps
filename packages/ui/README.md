# react-formsteps-ui

> Pre-built React components for [react-formsteps](https://github.com/franklinjunior23/react-formsteps). Optional layer on top of [`react-formsteps-core`](https://www.npmjs.com/package/react-formsteps-core).

[![npm version](https://img.shields.io/npm/v/react-formsteps-ui?style=flat-square&color=blue)](https://www.npmjs.com/package/react-formsteps-ui)
[![license](https://img.shields.io/badge/license-Custom-orange?style=flat-square)](./LICENSE)

---

## Installation

```bash
pnpm add react-formsteps-core react-formsteps-ui react-hook-form zod @hookform/resolvers
```

## Usage

```tsx
import { Steps, Step, StepBar, StepNav } from 'react-formsteps-ui';
import { z } from 'zod';

const schema1 = z.object({ name: z.string().min(1) });
const schema2 = z.object({ email: z.string().email() });

export function MyForm() {
  return (
    <Steps schemas={[schema1, schema2]} onSubmit={(data) => console.log(data)}>
      <Step title="Personal info">{/* your fields */}</Step>
      <Step title="Contact">{/* your fields */}</Step>
    </Steps>
  );
}
```

## Components

| Component   | Description                                            |
| ----------- | ------------------------------------------------------ |
| `<Steps>`   | Root provider. Manages all state and context.          |
| `<Step>`    | Wrapper for each step's content.                       |
| `<StepBar>` | Animated progress bar with optional step labels.       |
| `<StepNav>` | Back / Next / Submit buttons with built-in validation. |

For full documentation see the [main README](https://github.com/franklinjunior23/react-formsteps#readme) or the [API reference](https://github.com/franklinjunior23/react-formsteps/blob/main/apps/docs/pages/api-reference/components.mdx).

## License

Copyright (c) 2025 Franxx — see [LICENSE](./LICENSE) for full terms.
