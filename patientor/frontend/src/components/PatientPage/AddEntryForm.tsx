import { useState, SyntheticEvent } from "react";
import {
  Alert, Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText,
  MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography,
} from "@mui/material";

import { Diagnosis, EntryFormValues, HealthCheckRating } from "../../types";
import { assertNever } from "../../utils";

type EntryType = EntryFormValues["type"];

const entryTypes: { value: EntryType; label: string }[] = [
  { value: "HealthCheck", label: "Health check" },
  { value: "OccupationalHealthcare", label: "Occupational healthcare" },
  { value: "Hospital", label: "Hospital" },
];

const ratingOptions = Object.entries(HealthCheckRating).map(([label, value]) => ({ label, value }));

const isHealthCheckRating = (value: number): value is HealthCheckRating =>
  ratingOptions.some(option => option.value === value);

interface Props {
  diagnoses: Diagnosis[];
  error?: string;
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => Promise<void>;
}

const AddEntryForm = ({ diagnoses, error, onCancel, onSubmit }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    const found = entryTypes.find(t => t.value === event.target.value);
    if (found) {
      setType(found.value);
    }
  };

  const onRatingChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    if (isHealthCheckRating(value)) {
      setHealthCheckRating(value);
    }
  };

  const onCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const buildEntry = (): EntryFormValues => {
    const base = {
      date,
      description,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };
    switch (type) {
      case "HealthCheck":
        return { ...base, type, healthCheckRating };
      case "OccupationalHealthcare":
        return {
          ...base,
          type,
          employerName,
          sickLeave: sickLeaveStart || sickLeaveEnd
            ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
            : undefined,
        };
      case "Hospital":
        return { ...base, type, discharge: { date: dischargeDate, criteria: dischargeCriteria } };
      default:
        return assertNever(type);
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    void onSubmit(buildEntry());
  };

  const dateLabelProps = { inputLabel: { shrink: true } };

  return (
    <Box sx={{ border: "1px dashed", borderRadius: 2, padding: 2, marginY: 2 }}>
      <Typography variant="h6">New entry</Typography>
      {error && <Alert severity="error" sx={{ marginY: 1 }}>{error}</Alert>}
      <form onSubmit={addEntry}>
        <FormControl fullWidth margin="dense">
          <InputLabel id="entry-type-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-label"
            label="Entry type"
            value={type}
            onChange={onTypeChange}
          >
            {entryTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="dense"
          slotProps={dateLabelProps}
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          margin="dense"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={onCodesChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {diagnoses.map(d => (
              <MenuItem key={d.code} value={d.code}>
                <Checkbox checked={diagnosisCodes.includes(d.code)} />
                <ListItemText primary={`${d.code} ${d.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "HealthCheck" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="rating-label">Healthcheck rating</InputLabel>
            <Select
              labelId="rating-label"
              label="Healthcheck rating"
              value={healthCheckRating}
              onChange={onRatingChange}
            >
              {ratingOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.value} {o.label}</MenuItem>)}
            </Select>
          </FormControl>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              margin="dense"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick leave start"
              type="date"
              fullWidth
              margin="dense"
              slotProps={dateLabelProps}
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <TextField
              label="Sick leave end"
              type="date"
              fullWidth
              margin="dense"
              slotProps={dateLabelProps}
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}

        {type === "Hospital" && (
          <>
            <TextField
              label="Discharge day"
              type="date"
              fullWidth
              margin="dense"
              slotProps={dateLabelProps}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              margin="dense"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
          <Grid size="auto">
            <Button color="secondary" variant="contained" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid size="auto">
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;
