import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Female, Male, Transgender } from "@mui/icons-material";

import { Diagnosis, EntryFormValues, Gender, PatientDetails } from "../../types";
import patientService from "../../services/patients";
import { errorMessage } from "../../utils";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    default:
      return <Transgender />;
  }
};

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    if (!id) {
      return;
    }
    patientService.getById(id)
      .then(data => setPatient(data))
      .catch(() => setLoadError("Patient not found"));
  }, [id]);

  if (loadError) {
    return <Typography color="error">{loadError}</Typography>;
  }

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const closeForm = () => {
    setFormOpen(false);
    setFormError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.addEntry(patient.id, values);
      setPatient({ ...patient, entries: patient.entries.concat(entry) });
      closeForm();
    } catch (e: unknown) {
      setFormError(errorMessage(e));
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" component="h2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography sx={{ marginTop: 1 }}>ssn: {patient.ssn}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      {formOpen
        ? <AddEntryForm
            diagnoses={diagnoses}
            error={formError}
            onCancel={closeForm}
            onSubmit={submitNewEntry}
          />
        : <Button variant="contained" sx={{ marginY: 2 }} onClick={() => setFormOpen(true)}>
            Add New Entry
          </Button>
      }

      <Typography variant="h6" component="h3" sx={{ marginTop: 2 }}>entries</Typography>
      {patient.entries.length === 0 && <Typography>No entries yet.</Typography>}
      {patient.entries.map(entry => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </Box>
  );
};

export default PatientPage;
