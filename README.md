# react-formsteps

> Headless, type-safe multi-step form library for React — built on [react-hook-form](https://react-hook-form.com/) and [Zod](https://zod.dev/).

[![npm version](https://img.shields.io/npm/v/react-formsteps-core?style=flat-square&color=blue)](https://www.npmjs.com/package/react-formsteps-core)
[![npm version](https://img.shields.io/npm/v/react-formsteps-ui?style=flat-square&color=blue)](https://www.npmjs.com/package/react-formsteps-ui)
[![license](https://img.shields.io/badge/license-Custom-orange?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## Packages

| Package                                           | Version                                                                             | Description                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| [`react-formsteps-core`](./packages/core) | ![npm](https://img.shields.io/npm/v/react-formsteps-core?style=flat-square) | Headless hooks + context. No UI, no styles. |
| [`react-formsteps-ui`](./packages/ui)     | ![npm](https://img.shields.io/npm/v/react-formsteps-ui?style=flat-square)   | Optional pre-built React components.        |

---

## Features

- **Headless** — zero UI imposed. Works with any design system.
- **Per-step validation** — validates only the current step's Zod schema before advancing.
- **Type-safe** — strict TypeScript throughout. Types flow from Zod schemas into your fields.
- **Built on react-hook-form** — full compatibility with the RHF ecosystem.
- **Flexible** — use the hooks alone or drop in the ready-made components.
- **Tiny** — tree-shakeable, no CSS bundled.

---

## Installation

### Core only (headless)

```bash
# npm
npm install react-formsteps-core react-hook-form zod @hookform/resolvers

# pnpm
pnpm add react-formsteps-core react-hook-form zod @hookform/resolvers

# yarn
yarn add react-formsteps-core react-hook-form zod @hookform/resolvers
```

### With UI components

```bash
# npm
npm install react-formsteps-core react-formsteps-ui react-hook-form zod @hookform/resolvers

# pnpm
pnpm add react-formsteps-core react-formsteps-ui react-hook-form zod @hookform/resolvers
```

### Peer dependencies

| Dependency            | Version |
| --------------------- | ------- |
| `react`               | `>=18`  |
| `react-dom`           | `>=18`  |
| `react-hook-form`     | `>=7`   |
| `zod`                 | `>=3`   |
| `@hookform/resolvers` | `>=3`   |

---

## Quick start

### Headless — `useSteps` + `useStepForm`

```tsx
import { useSteps, useStepForm } from 'react-formsteps-core';
import { z } from 'zod';

const schemas = [
  z.object({ firstName: z.string().min(1, 'Required'), lastName: z.string().min(1, 'Required') }),
  z.object({ email: z.string().email('Enter a valid email') }),
  z.object({ password: z.string().min(8, 'Min. 8 characters') }),
];

export function RegistrationForm() {
  const { currentStep, next, prev, isFirst, isLast, progress, totalSteps } = useSteps({
    totalSteps: schemas.length,
  });

  const { form, nextWithValidation, isValidating } = useStepForm({
    schema: schemas[currentStep],
    onNext: (data) => console.log('Step data:', data),
  });

  const handleNext = async () => {
    const ok = await nextWithValidation();
    if (ok && !isLast) next();
    if (ok && isLast) console.log('All done!', form.getValues());
  };

  return (
    <form>
      {/* Progress */}
      <div>
        Step {currentStep + 1} of {totalSteps} — {progress}%
      </div>
      <progress value={progress} max={100} />

      {/* Step 1 */}
      {currentStep === 0 && (
        <>
          <input {...form.register('firstName')} placeholder="First name" />
          <input {...form.register('lastName')} placeholder="Last name" />
        </>
      )}

      {/* Step 2 */}
      {currentStep === 1 && <input {...form.register('email')} placeholder="Email" />}

      {/* Step 3 */}
      {currentStep === 2 && (
        <input {...form.register('password')} type="password" placeholder="Password" />
      )}

      {/* Navigation */}
      <button type="button" onClick={prev} disabled={isFirst}>
        Back
      </button>
      <button type="button" onClick={handleNext} disabled={isValidating}>
        {isLast ? 'Submit' : 'Next'}
      </button>
    </form>
  );
}
```

---

### With UI components — `<Steps>` + `<Step>`

```tsx
import { Steps, Step, StepBar, StepNav } from 'react-formsteps-ui';
import { z } from 'zod';

const schema1 = z.object({ name: z.string().min(1, 'Required') });
const schema2 = z.object({ email: z.string().email() });
const schema3 = z.object({ password: z.string().min(8) });

export function RegistrationForm() {
  return (
    <Steps
      schemas={[schema1, schema2, schema3]}
      onSubmit={(data) => console.log('Submitted:', data)}
    >
      <Step title="Personal info">{/* your fields */}</Step>

      <Step title="Contact">{/* your fields */}</Step>

      <Step title="Security">{/* your fields */}</Step>
    </Steps>
  );
}
```

---

## API

### `useSteps(options)`

Manages step navigation state.

```ts
const {
  currentStep,  // number — 0-indexed
  totalSteps,   // number
  isFirst,      // boolean
  isLast,       // boolean
  next,         // () => void
  prev,         // () => void
  goTo,         // (index: number) => void
  progress,     // number — 0 to 100
} = useSteps({ totalSteps: 3, initialStep?: 0, onComplete?: () => void });
```

| Option        | Type         | Default | Description                                              |
| ------------- | ------------ | ------- | -------------------------------------------------------- |
| `totalSteps`  | `number`     | —       | **Required.** Must be a positive integer                 |
| `initialStep` | `number`     | `0`     | Starting step index                                      |
| `onComplete`  | `() => void` | —       | Called once when the user first arrives at the last step |

---

### `useStepForm(options)`

Integrates react-hook-form with per-step Zod validation.

```ts
const {
  form,               // UseFormReturn<z.infer<typeof schema>>
  nextWithValidation, // () => Promise<boolean>
  isValidating,       // boolean
} = useStepForm({ schema, defaultValues?, onNext? });
```

| Option          | Type                        | Description                                   |
| --------------- | --------------------------- | --------------------------------------------- |
| `schema`        | `ZodType`                   | **Required.** Zod schema for the current step |
| `defaultValues` | `Partial<z.infer<TSchema>>` | Initial field values                          |
| `onNext`        | `(data) => void`            | Called with validated data when advancing     |

---

### `useStepsContext()`

Access step state from any component inside a `<Steps>` or `<StepsProvider>`.

```ts
import { useStepsContext } from 'react-formsteps-core';

const { currentStep, totalSteps, next, prev, goTo, formData } = useStepsContext();
```

---

### `<StepsProvider>` — headless context

Use the context without the UI package.

```tsx
import { StepsProvider, useStepsContext } from 'react-formsteps-core';

<StepsProvider schemas={[schema1, schema2]} onSubmit={handleSubmit}>
  <MyCustomWizard />
</StepsProvider>;
```

---

### Utilities

```ts
import { validateStep, mergeSchemas, validateAllSteps } from 'react-formsteps-core';

// Validate a single step — never throws
const result = await validateStep(schema, data);
// { success: boolean, data?, errors?: Record<string, string> }

// Merge multiple ZodObject schemas into one
const fullSchema = mergeSchemas([step1Schema, step2Schema, step3Schema]);

// Validate all accumulated data against merged schemas
const result = await validateAllSteps(schemas, allData);
```

---

### UI Components

| Component   | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `<Steps>`   | Root provider. Pass `schemas` and `onSubmit`.               |
| `<Step>`    | Wrapper for each step's content. Accepts optional `title`.  |
| `<StepBar>` | Progress bar with optional step labels.                     |
| `<StepNav>` | Back / Next / Submit buttons with built-in validation gate. |

---

## TypeScript

All APIs are fully typed. Enable `strict: true` in your `tsconfig.json` for the best experience.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Import types directly:

```ts
import type {
  StepSchema,
  StepConfig,
  StepsContextValue,
  UseStepsOptions,
  UseStepsReturn,
  UseStepFormOptions,
  UseStepFormReturn,
  StepsProviderProps,
} from 'react-formsteps-core';
```

---

## Contributing

Contributions via pull requests are welcome. Please open an issue first to discuss significant changes.

By submitting a contribution you agree that the original author (Franxx) retains full ownership and copyright of the project, including your contributions.

---

## License

Copyright (c) 2025 Franxx — see [LICENSE](./LICENSE) for full terms.

This software is free for personal, educational, and open source use. **Commercial use requires explicit written permission from the author.** See the license for details.

---

<p align="center">Made by <a href="https://github.com/franklinjunior23">Franxx</a></p>
