import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App.js";
import { getInlineLoader, callApi } from "../Helpers.js";
import {
  STR_SUBMIT, STR_SUCCESS, STR_CREATE_FULL_NAME, STR_CREATE_AGE,
  STR_CREATE_OCCUPATION, STR_CREATE_PHONE, STR_CREATE_EMAIL, STR_CREATE_RETIREMENT_AGE,
  STR_CREATE_YEARS_TO_RETIRE, STR_CREATE_MONTHLY_EXPENSES, STR_CREATE_TOTAL_SAVINGS,
  STR_CREATE_INVESTMENTS, STR_CREATE_NON_INCOME_ASSETS,
  STR_CREATE_HEALTH_INSURANCE, STR_CREATE_DEBTS, STR_CREATE_FINANCIAL_FREEDOM_NUMBER,
  STR_CREATE_FINANCIAL_FREEDOM_PERCENT, STR_CREATE_WILL_PLAN, STR_CREATE_SIDE_PROJECTS,
  STR_CREATE_PASSIVE_INCOME_GOAL, STR_CREATE_MONTHLY_INVESTMENT_PLAN,
  STR_CREATE_RETIREMENT_MONTHLY_EXPENSES, STR_CREATE_TEN_YEAR_GOAL, STR_CREATE_DATE_CREATED
} from "../Strings.js";

export default function RetirementForm() {
  const appContext = useContext(AppContext);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for form inputs including radios
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    occupation: "",
    phone: "",
    email: "",
    retirementAge: "",
    yearsToRetire: "",
    monthlyExpenses: "",
    totalSavings: "",
    investments: "",
    nonIncomeAssets: "",
    healthInsurance: "", // radio
    debts: "",           // radio
    totalDebtAmount: "", // dependent on debts
    financialFreedomNumber: "",
    financialFreedomPercent: "",
    willPlan: "",        // radio
    sideProjects: "",    // radio
    passiveIncomeGoal: "",
    monthlyInvestmentPlan: "", // radio
    retirementMonthlyExpenses: "",
    tenYearGoal: "",
    dateCreated: new Date().toISOString().split("T")[0],
  });

  // State for error messages for missing radios or other fields
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    appContext.setShowOverlayLoader(loading);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error on input change
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // List of required radio fields rendered independently
  const radioFields = [
    { name: "healthInsurance", label: STR_CREATE_HEALTH_INSURANCE[appContext.language] },
    { name: "debts", label: STR_CREATE_DEBTS[appContext.language] },
    { name: "willPlan", label: STR_CREATE_WILL_PLAN[appContext.language] },
    { name: "sideProjects", label: STR_CREATE_SIDE_PROJECTS[appContext.language] },
    { name: "monthlyInvestmentPlan", label: STR_CREATE_MONTHLY_INVESTMENT_PLAN[appContext.language] },
  ];

  // Non-radio required fields
  const requiredFields = [
    "fullName", "age", "occupation", "phone", "email", "retirementAge", "yearsToRetire",
    "monthlyExpenses", "totalSavings", "investments", "nonIncomeAssets", 
    "financialFreedomNumber", "financialFreedomPercent", "passiveIncomeGoal",
    "retirementMonthlyExpenses", "tenYearGoal", "dateCreated"
  ];

  const validateForm = () => {
    const newErrors = {};

    // Validate non-radio fields
    requiredFields.forEach(field => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = `${field} is required`;
      }
    });

    // Validate radio fields
    radioFields.forEach(({ name, label }) => {
      if (!form[name]) {
        newErrors[name] = `${label} is required`;
      }
    });

    // If debts === "Ndiyo", totalDebtAmount is required
    if (form.debts === "Ndiyo") {
      if (!form.totalDebtAmount || form.totalDebtAmount.trim() === "") {
        newErrors.totalDebtAmount = "Total Debt Amount is required because Debts is Ndiyo";
      }
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Show a message or just rely on errors display
      appContext.tellError("Please fill all required fields");
      return;
    }

    setLoading(true);
    const response = await callApi("save-retirement-form", form);
    if (response.status === 1) {
      appContext.tellMessage(STR_SUCCESS[appContext.language]);
      appContext.navBack();
    } else {
      appContext.tellError(response.msg);
    }
    setLoading(false);
  };

  if (!ready) {
    return <div className="container mSupportLoading">{getInlineLoader()}</div>;
  }

  // Fields without radio types
  const fields = [
    { name: "fullName", label: STR_CREATE_FULL_NAME[appContext.language] },
    { name: "age", label: STR_CREATE_AGE[appContext.language] },
    { name: "occupation", label: STR_CREATE_OCCUPATION[appContext.language] },
    { name: "phone", label: STR_CREATE_PHONE[appContext.language] },
    { name: "email", label: STR_CREATE_EMAIL[appContext.language] },
    { name: "retirementAge", label: STR_CREATE_RETIREMENT_AGE[appContext.language] },
    { name: "yearsToRetire", label: STR_CREATE_YEARS_TO_RETIRE[appContext.language] },
    { name: "monthlyExpenses", label: STR_CREATE_MONTHLY_EXPENSES[appContext.language] },
    { name: "totalSavings", label: STR_CREATE_TOTAL_SAVINGS[appContext.language] },
    { name: "investments", label: STR_CREATE_INVESTMENTS[appContext.language] },
    { name: "nonIncomeAssets", label: STR_CREATE_NON_INCOME_ASSETS[appContext.language] },
    { name: "financialFreedomNumber", label: STR_CREATE_FINANCIAL_FREEDOM_NUMBER[appContext.language] },
    { name: "financialFreedomPercent", label: STR_CREATE_FINANCIAL_FREEDOM_PERCENT[appContext.language] },
    { name: "passiveIncomeGoal", label: STR_CREATE_PASSIVE_INCOME_GOAL[appContext.language] },
    { name: "retirementMonthlyExpenses", label: STR_CREATE_RETIREMENT_MONTHLY_EXPENSES[appContext.language] },
    { name: "tenYearGoal", label: STR_CREATE_TEN_YEAR_GOAL[appContext.language], type: "textarea" },
    { name: "dateCreated", label: STR_CREATE_DATE_CREATED[appContext.language] },
  ];

  const renderRadioGroup = (name, label) => (
    <div className="col-md-6 mb-3" key={name}>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-3">
        {["Ndiyo", "Hapana"].map(option => (
          <div className="form-check" key={`${name}_${option}`}>
            <input
              className="form-check-input"
              type="radio"
              id={`${name}_${option}`}
              name={name}
              value={option}
              checked={form[name] === option}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={`${name}_${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>

      {errors[name] && <div className="text-danger mt-1">{errors[name]}</div>}

      {name === "debts" && form.debts === "Ndiyo" && (
        <div className="mt-2">
          <label className="form-label">Total Debt Amount (Tsh)</label>
          <input
            required
            className={`form-control ${errors.totalDebtAmount ? "is-invalid" : ""}`}
            name="totalDebtAmount"
            type="text"
            value={form.totalDebtAmount}
            onChange={handleChange}
          />
          {errors.totalDebtAmount && <div className="invalid-feedback">{errors.totalDebtAmount}</div>}
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        {/* Non-radio fields */}
        {fields.map(({ name, label, type }) => (
          <div className="col-md-6 mb-3" key={name}>
            <label className="form-label">{label}</label>
            {type === "textarea" ? (
              <>
                <textarea
                  required
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </>
            ) : (
              <>
                <input
                  required
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  name={name}
                  type={name.toLowerCase().includes("date") ? "date" : "text"}
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </>
            )}
          </div>
        ))}

        {/* Radio fields */}
        {radioFields.map(({ name, label }) => renderRadioGroup(name, label))}

        <div className="col-12 text-end mt-5">
          <button className="btn btn-success" onClick={handleSubmit}>
            {STR_SUBMIT[appContext.language]}
          </button>
        </div>
      </div>
    </div>
  );
}
