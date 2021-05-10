import "moment";
import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  InputLabel,
  Button,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { getNotificationToken, useGlobalStyles } from "../../constants";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { ALERTS_API, GOV_API } from "../../axios";
import MomentUtils from "@date-io/moment";

function Form() {
  const classes = useGlobalStyles();
  const [paid, setPaid] = useState<boolean>(false);
  const [repeatEvery, setRepeatEvery] = useState<number>(1);
  const [selectedStateId, setSelectedStateId] = useState<number>(1);
  const [fetchedStates, setFetchedStates] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(1);
  const [fetchedDistricts, setFetchedDistricts] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedStartingDate, setSelectedStartingDate] = useState<Date>(
    new Date()
  );
  const [email, setEmail] = useState<string | null>(null);
  const [minAge, setMinAge] = useState<number>(45);
  const [numberOfAvailableSlots, setNumberOfAvailableSlots] = useState<number>(
    10
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | false>();
  const [success, setSuccess] = useState<boolean>(false);
  const [pincodes, setPincodes] = useState<string | null>(null);
  const handleSubmit = async (e: React.MouseEvent): Promise<void> => {
    try {
      setSuccess(false);
      e.preventDefault();
      const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      setLoading(true);
      setIsError(false);
      if (!email) {
        throw new Error("Email is a required param");
      }
      if (!EMAIL_REGEX.test(email)) {
        throw new Error("Email is not valid");
      }
      let pincodesArray: string[] = [];

      if (pincodes && pincodes !== "" && /[0-9]+([,0-9]+)*/.test(pincodes)) {
        pincodesArray = pincodes.split(",");
      }
      const prepareData = {
        startingDate: selectedStartingDate,
        paid,
        minAge,
        email,
        ...(Array.isArray(pincodesArray) && { pincodes: pincodesArray }),
        districtId: selectedDistrictId,
        repeatEvery,
      };
      await ALERTS_API.post("/scheduleItems/submit", prepareData);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setIsError(error.message);
      setLoading(false);
      setSuccess(false);
      console.error("Error ocurred while submitting to the backend\n", error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const { states } = (
          await GOV_API.get(`/v2/admin/location/states`)
        ).data;
        if (!Array.isArray(states)) return;
        setFetchedStates(
          states.map((e) => ({ id: e.state_id, name: e.state_name }))
        );
      } catch (e) {
        console.error("Error while fetching states\n", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { districts } = (
          await GOV_API.get(`/v2/admin/location/districts/${selectedStateId}`)
        ).data;
        if (!Array.isArray(districts)) return;
        setFetchedDistricts(
          districts.map((e) => ({ id: e.district_id, name: e.district_name }))
        );
        setSelectedDistrictId(districts[0].district_id as number);
      } catch (e) {
        console.error(
          "Error on fetching public districts for given stateId\n",
          e
        );
      }
    })();
  }, [selectedStateId]);
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              className={classes.formControl}
              disableToolbar
              variant="inline"
              format="DD-MM-YYYY"
              margin="normal"
              id="starting-date-picker"
              label="Date Starting From"
              value={selectedStartingDate}
              onChange={(date) =>
                setSelectedStartingDate(date?.toDate() || new Date())
              }
              KeyboardButtonProps={{ "aria-label": "change-date" }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <FormControl className={classes.formControl}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
                name="paid"
                color="primary"
              />
            }
            label="Paid Centers"
          />
        </FormGroup>
      </FormControl>

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormGroup row>
              <InputLabel id="minimum-age">Minimum Age</InputLabel>
              <Select
                labelId="minimum-age"
                id="minimum-age-select"
                value={minAge}
                onChange={(e) => {
                  setMinAge(e.target.value as number);
                }}
              >
                {[0, 18, 45].map((age) => (
                  <MenuItem
                    value={age}
                    key={`select-min-age-value-${age}`}
                  >{`${age}y`}</MenuItem>
                ))}
              </Select>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormGroup row>
              <InputLabel id="number-of-slots-above">
                Number of slots greater than?
              </InputLabel>
              <Select
                labelId="number-of-slots-above"
                id="number-of-slots-above-select"
                value={numberOfAvailableSlots}
                onChange={(e) => {
                  setNumberOfAvailableSlots(e.target.value as number);
                }}
              >
                {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100].map(
                  (slots) => (
                    <MenuItem
                      value={slots}
                      key={`select-number-of-slots-value-${slots}`}
                    >{`${slots}`}</MenuItem>
                  )
                )}
              </Select>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormGroup row>
              <InputLabel id="repeat-every-hours">
                Repeat Every (in Hrs)
              </InputLabel>
              <Select
                labelId="repeat-every-hours"
                id="repeat-every-select"
                value={repeatEvery}
                onChange={(e) => {
                  const value: number =
                    typeof e.target.value !== "number" ? -1 : e.target.value;
                  setRepeatEvery(value);
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hr) => (
                  <MenuItem
                    value={hr}
                    key={`select-hr-value-${hr}`}
                  >{`${hr} hr${hr > 1 ? "s" : ""}`}</MenuItem>
                ))}
              </Select>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormGroup row>
              <InputLabel id="state-name">State Name</InputLabel>
              <Select
                labelId="state-name"
                id="state-name-select"
                value={selectedStateId}
                onChange={(e) => {
                  setSelectedStateId(e.target.value as number);
                }}
              >
                {fetchedStates.map((state) => (
                  <MenuItem
                    value={state.id}
                    key={`select-state-value-${state.id}`}
                  >
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormGroup row>
              <InputLabel id="input-district">District</InputLabel>
              <Select
                labelId="input-district"
                id="input-district-select"
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value as number);
                }}
              >
                {fetchedDistricts.map((district) => (
                  <MenuItem
                    value={district.id}
                    key={`select-district-value-${district.id}`}
                  >
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <TextField
            className={classes.formControl}
            id="input-pincodes"
            type="text"
            label="Pincodes (Seperated by commas)"
            placeholder="110035, 560095"
            value={pincodes}
            onChange={(e) => setPincodes(e.target.value)}
          />
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      {/* GOING TO REPEAT THE BELOW SECTION OF CODE A LOT. */}
      <Grid container>
        <Grid item xs={12}>
          <TextField
            className={classes.formControl}
            id="input-email"
            required
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
      </Grid>
      {/* IN BETWEEN THESE TWO COMMENTS IS THE REPEATING SECTION */}

      <Grid container>
        <Grid item xs={12}>
          <div className={classes.formControl}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={debounce(handleSubmit, 2500, { maxWait: 5000 })}
              disabled={success}
            >
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <div className={classes.formControl}>
            {loading && <CircularProgress />}
            {isError && <small className="text-danger">{isError}</small>}
            {success && (
              <small className="text-success">Successfully Registered</small>
            )}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Form;
