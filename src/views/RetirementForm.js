import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App.js';
import { getInlineLoader, callApi } from '../Helpers.js';
import {
  STR_SUBMIT, STR_SUCCESS,
  STR_CREATE_FULL_NAME, STR_CREATE_AGE, STR_CREATE_OCCUPATION, STR_CREATE_PHONE, STR_CREATE_EMAIL,
  STR_CREATE_RETIREMENT_AGE, STR_CREATE_MONTHLY_EXPENSES, STR_CREATE_TOTAL_SAVINGS, STR_CREATE_INVESTMENTS,
  STR_CREATE_NON_INCOME_ASSETS, STR_CREATE_HEALTH_INSURANCE, STR_CREATE_DEBTS,
  STR_CREATE_WILL_PLAN, STR_CREATE_SIDE_PROJECTS, STR_CREATE_MONTHLY_INVESTMENT_PLAN,
  STR_CREATE_RETIREMENT_MONTHLY_EXPENSES, STR_CREATE_INCOME_EARNED_FREE, STR_CREATE_TEN_YEAR_GOAL,
 STR_PERSONAL_DETAILS,STR_FINANCIAL_DETAILS,STR_OPTIONAL_PLANNING,STR_FUTURE_PLANNING,
  STR_OPTIONS_YES, STR_OPTIONS_NO,
} from '../Strings.js';

export default function RetirementForm() {
  const appContext = useContext(AppContext);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [form, setForm] = useState({
    name: '', age: '', occupation: '', phone: '', email: '',
    ageToRetire: '', mounthlyExpenditure: '', saving: '', investment: '', asserts: '',
    healthInsurance: '', loan: '', loanAmount: '',
    willPlan: '', projects: '', mounthlyInvestmentPlan: '',
    mounthlyExpenditureAfterRetire: '', incomeEarnedFree: '', tenYearsPlan: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => setReady(true), []);
  useEffect(() => appContext.setShowOverlayLoader(loading), [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['healthInsurance', 'loan', 'willPlan', 'projects', 'mounthlyInvestmentPlan'].includes(name)
      ? parseInt(value)
      : value;
    setForm(prev => ({ ...prev, [name]: parsedValue }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const requiredFields = [
    'name', 'age', 'occupation', 'phone', 'email',
    'ageToRetire', 'mounthlyExpenditure', 'saving', 'investment', 'asserts',
    'incomeEarnedFree', 'tenYearsPlan', 'mounthlyExpenditureAfterRetire',
  ];

  const radioFields = [
    { name: 'healthInsurance', label: STR_CREATE_HEALTH_INSURANCE[appContext.language] },
    { name: 'loan', label: STR_CREATE_DEBTS[appContext.language] },
    { name: 'willPlan', label: STR_CREATE_WILL_PLAN[appContext.language] },
    { name: 'projects', label: STR_CREATE_SIDE_PROJECTS[appContext.language] },
    { name: 'mounthlyInvestmentPlan', label: STR_CREATE_MONTHLY_INVESTMENT_PLAN[appContext.language] },
  ];

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = `${field} is required`;
      }
    });

    radioFields.forEach(({ name, label }) => {
      if (form[name] !== 0 && form[name] !== 1) {
        newErrors[name] = `${label} is required`;
      }
    });

    if (form.loan === 1 && !form.loanAmount?.toString().trim()) {
      newErrors.loanAmount = 'Loan amount is required';
    }

    if (form.loanAmount === '') {
      form.loanAmount = 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      appContext.tellError('Please fill all required fields');
      return;
    }

    setLoading(true);
    const response = await callApi('evaluate', form);
    if (response.status === 1) {
      appContext.tellMessage(STR_SUCCESS[appContext.language]);
      setResults(response.data);
    } else {
      appContext.tellError(response.msg);
    }
    setLoading(false);
  };

  if (!ready) return <div className="container mSupportLoading">{getInlineLoader()}</div>;

  const fieldLabels = {
    name: STR_CREATE_FULL_NAME,
    age: STR_CREATE_AGE,
    occupation: STR_CREATE_OCCUPATION,
    phone: STR_CREATE_PHONE,
    email: STR_CREATE_EMAIL,
    ageToRetire: STR_CREATE_RETIREMENT_AGE,
    mounthlyExpenditure: STR_CREATE_MONTHLY_EXPENSES,
    saving: STR_CREATE_TOTAL_SAVINGS,
    investment: STR_CREATE_INVESTMENTS,
    asserts: STR_CREATE_NON_INCOME_ASSETS,
    mounthlyExpenditureAfterRetire: STR_CREATE_RETIREMENT_MONTHLY_EXPENSES,
    incomeEarnedFree: STR_CREATE_INCOME_EARNED_FREE,
    tenYearsPlan: STR_CREATE_TEN_YEAR_GOAL,
  };

 

  const renderRadioGroup = (name, label) => (
    <div className="col-md-6 mb-3" key={name}>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-3">
        {[{ label: STR_OPTIONS_YES, value: 1 }, { label: STR_OPTIONS_NO, value: 0 }].map(({ label: optLabel, value }) => (
          <label className="radio-container" key={`${name}_${value}`}>
            <input
              type="radio"
              name={name}
              value={value}
              checked={form[name] === value}
              onChange={handleChange}
              id={`${name}_${value}`}
            />
            <span className="radio-checkmark"></span>
            <span className="radio-label">{optLabel[appContext.language]}</span>
          </label>
        ))}
      </div>
      {errors[name] && <div className="text-danger mt-1">{errors[name]}</div>}

      {name === 'loan' && form.loan === 1 && (
        <div className="mt-2">
          <label className="form-label">Loan Amount (Tsh)</label>
          <input
            className={`form-control ${errors.loanAmount ? 'is-invalid' : ''}`}
            name="loanAmount"
            type="text"
            value={form.loanAmount}
            onChange={handleChange}
          />
          {errors.loanAmount && <div className="invalid-feedback">{errors.loanAmount}</div>}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mb-5">

      {/* Personal Details */}
      <h4 className="mb-3 mt-4">{STR_PERSONAL_DETAILS[appContext.language]}</h4>
      <div className="row">
        {['name', 'age', 'occupation', 'phone', 'email'].map(name => (
          <div className="col-md-6 mb-3" key={name}>
            <label className="form-label">{fieldLabels[name][appContext.language]}</label>
            <input
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
              name={name}
              type="text"
              value={form[name]}
              onChange={handleChange}
            />
            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
          </div>
        ))}
      </div>

      {/* Financial Details */}
      <h4 className="mb-3 mt-4">{STR_FINANCIAL_DETAILS[appContext.language]}</h4>
      <div className="row">
        {['ageToRetire', 'mounthlyExpenditure', 'saving', 'investment', 'asserts'].map(name => (
          <div className="col-md-6 mb-3" key={name}>
            <label className="form-label">{fieldLabels[name][appContext.language]}</label>
            <input
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
              name={name}
              type="text"
              value={form[name]}
              onChange={handleChange}
            />
            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
          </div>
        ))}
      </div>

      {/* Optional Planning */}
      <h4 className="mb-3 mt-4">{STR_OPTIONAL_PLANNING[appContext.language]}</h4>
      <div className="row">
        {radioFields.map(({ name, label }) => renderRadioGroup(name, label))}
      </div>

      {/* Future Planning */}
      <h4 className="mb-3 mt-4">{STR_FUTURE_PLANNING[appContext.language]}</h4>
      <div className="row">
        {['mounthlyExpenditureAfterRetire', 'incomeEarnedFree'].map(name => (
          <div className="col-md-6 mb-3" key={name}>
            <label className="form-label">{fieldLabels[name][appContext.language]}</label>
            <input
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
              name={name}
              type="text"
              value={form[name]}
              onChange={handleChange}
            />
            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
          </div>
        ))}

        {/* Ten Year Plan Textarea */}
        <div className="col-12 mb-3">
          <label className="form-label">{fieldLabels.tenYearsPlan[appContext.language]}</label>
          <textarea
            className={`form-control ${errors.tenYearsPlan ? 'is-invalid' : ''}`}
            name="tenYearsPlan"
            value={form.tenYearsPlan}
            onChange={handleChange}
          />
          {errors.tenYearsPlan && <div className="invalid-feedback">{errors.tenYearsPlan}</div>}
        </div>
      </div>

      {/* Submit */}
      <div className="col-12 text-end mt-4">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? getInlineLoader() : STR_SUBMIT[appContext.language]}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-5 p-4 border border-success rounded bg-light">
          <h4 className="mb-3">Evaluation Results</h4>
          <h3>
            <span className="badge bg-success">
              {JSON.stringify(results.totalPercentage, null, 2)}%
            </span>
          </h3>
          <h2 className="medium">{JSON.stringify(results.feedback, null, 2)}</h2>
        </div>
      )}
    </div>
  );
}
