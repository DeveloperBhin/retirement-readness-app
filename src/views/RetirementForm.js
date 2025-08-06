import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App.js";
import { getInlineLoader, callApi } from "../Helpers.js";
import {
  STR_CREATE_NEW, STR_SUBMIT, STR_SUCCESS, STR_CREATE_FULL_NAME, STR_CREATE_AGE,
  STR_CREATE_OCCUPATION, STR_CREATE_PHONE, STR_CREATE_EMAIL, STR_CREATE_RETIREMENT_AGE,
  STR_CREATE_YEARS_TO_RETIRE, STR_CREATE_MONTHLY_EXPENSES, STR_CREATE_TOTAL_SAVINGS,
  STR_CREATE_INVESTMENTS, STR_CREATE_NON_INCOME_ASSETS, STR_CREATE_HEALTH_INSURANCE,
  STR_CREATE_DEBTS, STR_CREATE_FINANCIAL_FREEDOM_NUMBER, STR_CREATE_FINANCIAL_FREEDOM_PERCENT,
  STR_CREATE_WILL_PLAN, STR_CREATE_SIDE_PROJECTS, STR_CREATE_PASSIVE_INCOME_GOAL,
  STR_CREATE_MONTHLY_INVESTMENT_PLAN, STR_CREATE_RETIREMENT_MONTHLY_EXPENSES,
  STR_CREATE_TEN_YEAR_GOAL, STR_CREATE_DATE_CREATED
} from "../Strings.js";

export default function RetirementForm() {
  const appContext = useContext(AppContext);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

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
    healthInsurance: "",
    debts: "",
    totalDebtAmount: "",
    financialFreedomNumber: "",
    financialFreedomPercent: "",
    willPlan: "",
    sideProjects: "",
    passiveIncomeGoal: "",
    monthlyInvestmentPlan: "",
    retirementMonthlyExpenses: "",
    tenYearGoal: "",
    dateCreated: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    appContext.setShowOverlayLoader(loading);
  }, [loading]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    const response = await callApi("save-retirement-form", form);

    if (response.status === 1) {
      appContext.tellMessage(STR_SUCCESS[appContext.language]);
      appContext.navBack();
    } else {
							appContext.tellError(response.msg);
    }

    setLoading(false);
  }

  if (!ready) {
    return <div className="container mSupportLoading">{getInlineLoader()}</div>;
  }

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
    { name: "healthInsurance", label: STR_CREATE_HEALTH_INSURANCE[appContext.language], type: "radio" },
    { name: "debts", label: STR_CREATE_DEBTS[appContext.language], type: "radio" },
    { name: "totalDebtAmount", label: "Total Debt Amount (Tsh)" },
    { name: "financialFreedomNumber", label: STR_CREATE_FINANCIAL_FREEDOM_NUMBER[appContext.language] },
    { name: "financialFreedomPercent", label: STR_CREATE_FINANCIAL_FREEDOM_PERCENT[appContext.language] },
    { name: "willPlan", label: STR_CREATE_WILL_PLAN[appContext.language], type: "radio" },
    { name: "sideProjects", label: STR_CREATE_SIDE_PROJECTS[appContext.language], type: "radio" },
    { name: "passiveIncomeGoal", label: STR_CREATE_PASSIVE_INCOME_GOAL[appContext.language] },
    { name: "monthlyInvestmentPlan", label: STR_CREATE_MONTHLY_INVESTMENT_PLAN[appContext.language], type: "radio" },
    { name: "retirementMonthlyExpenses", label: STR_CREATE_RETIREMENT_MONTHLY_EXPENSES[appContext.language] },
    { name: "tenYearGoal", label: STR_CREATE_TEN_YEAR_GOAL[appContext.language], type: "textarea" },
    { name: "dateCreated", label: STR_CREATE_DATE_CREATED[appContext.language] }
  ];

  return (
    <div className="container">
      <div className="row">
        {fields.map(({ name, label, type }) => (
          <div className="col-md-6 mb-3" key={name}>
            <label className="form-label">{label}</label>
            {type === "radio" ? (
              <>
                {["NDIO", "HAPANA"].map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      required
                      className="form-check-input"
                      type="radio"
                      name={name}
                      value={option}
                      checked={form[name] === option}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      {option === "NDIO" ? "Ndiyo" : "Hapana"}
                    </label>
                  </div>
                ))}
              </>
            ) : type === "textarea" ? (
              <textarea
                required
                className="form-control"
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
            ) : (
              <input
                required
                className="form-control"
                name={name}
                type={name.includes("date") ? "date" : "text"}
                value={form[name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <div className="col-md-12 text-end mt-5">
          <button className="btn btn-success" onClick={handleSubmit}>
            {STR_SUBMIT[appContext.language]}
          </button>
        </div>
      </div>
    </div>
  );
}
