import type { CoursePart } from '../types';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  const title = <strong>{part.name} {part.exerciseCount}</strong>;

  switch (part.kind) {
    case 'basic':
      return (
        <p>
          {title}<br />
          <em>{part.description}</em>
        </p>
      );
    case 'group':
      return (
        <p>
          {title}<br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          {title}<br />
          <em>{part.description}</em><br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case 'special':
      return (
        <p>
          {title}<br />
          <em>{part.description}</em><br />
          required skills: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
