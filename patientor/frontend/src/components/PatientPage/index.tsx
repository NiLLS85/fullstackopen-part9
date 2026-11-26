import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Female, Male, Transgender } from "@mui/icons-material";

import { Gender, PatientDetails } from "../../types";
import patientService from "../../services/patients";

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

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    patientService.getById(id)
      .then(data => setPatient(data))
      .catch(() => setError("Patient not found"));
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" component="h2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography sx={{ marginTop: 1 }}>ssn: {patient.ssn}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
    </Box>
  );
};

export default PatientPage;
