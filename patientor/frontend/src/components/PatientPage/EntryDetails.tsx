import { Box, Typography } from "@mui/material";
import { LocalHospital, MedicalServices, Work } from "@mui/icons-material";

import { Diagnosis, Entry } from "../../types";
import { assertNever } from "../../utils";
import HealthRatingBar from "../HealthRatingBar";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const DiagnosisList = ({ codes, diagnoses }: { codes?: string[]; diagnoses: Diagnosis[] }) => {
  if (!codes || codes.length === 0) {
    return null;
  }
  return (
    <ul>
      {codes.map(code => (
        <li key={code}>
          {code} {diagnoses.find(d => d.code === code)?.name}
        </li>
      ))}
    </ul>
  );
};

const TypeSpecificDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthRatingBar showText={true} rating={entry.healthCheckRating} />;
    case "OccupationalHealthcare":
      return entry.sickLeave
        ? <Typography>sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}</Typography>
        : null;
    case "Hospital":
      return <Typography>discharge: {entry.discharge.date} {entry.discharge.criteria}</Typography>;
    default:
      return assertNever(entry);
  }
};

const EntryIcon = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <MedicalServices />;
    case "OccupationalHealthcare":
      return <><Work /> {entry.employerName}</>;
    case "Hospital":
      return <LocalHospital />;
    default:
      return assertNever(entry);
  }
};

const EntryDetails = ({ entry, diagnoses }: Props) => (
  <Box sx={{ border: 1, borderRadius: 2, padding: 1, marginBottom: 1 }}>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {entry.date} <EntryIcon entry={entry} />
    </Typography>
    <Typography><em>{entry.description}</em></Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <TypeSpecificDetails entry={entry} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

export default EntryDetails;
