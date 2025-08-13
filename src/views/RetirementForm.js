import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App.js';
import { getInlineLoader, callApi } from '../Helpers.js';
import jsPDF from 'jspdf';
import {
  STR_SUBMIT, STR_SUCCESS,
  STR_CREATE_FULL_NAME, STR_CREATE_AGE, STR_CREATE_OCCUPATION, STR_CREATE_PHONE, STR_CREATE_EMAIL,
  STR_CREATE_RETIREMENT_AGE, STR_CREATE_MONTHLY_EXPENSES, STR_CREATE_TOTAL_SAVINGS, STR_CREATE_INVESTMENTS,
  STR_CREATE_NON_INCOME_ASSETS, STR_CREATE_HEALTH_INSURANCE, STR_CREATE_DEBTS,
  STR_CREATE_WILL_PLAN, STR_CREATE_SIDE_PROJECTS, STR_CREATE_MONTHLY_INVESTMENT_PLAN,
  STR_CREATE_RETIREMENT_MONTHLY_EXPENSES, STR_CREATE_INCOME_EARNED_FREE, STR_CREATE_TEN_YEAR_GOAL,
 STR_PERSONAL_DETAILS,STR_FINANCIAL_DETAILS,STR_OPTIONAL_PLANNING,STR_FUTURE_PLANNING,STR_CREATE_LOAN_AMOUNT,
  STR_OPTIONS_YES, STR_OPTIONS_NO,STR_REQUIRED,STR_EVALUATION_RESULT,STR_NAME_OF_PARTICIPANT,STR_YEARS_LEFT_BEFORE_RETIREMENT,
  STR_CREATE_MONTHLY_EXPENDITURE,STR__FINANCIAL_FREEDOM,STR__FINANCIAL_FREEDOM_PERCENT,STR_FINANCIAL_DETAILS_NOW,
  STR_CREATE_PROJECTS,STR__IMPORTANT_PREPARATION,STR__INVESTMENT_AND_WILL_PLANS,STR_TOTAL_MARKS,
  STR_CREATE_ASSERTS,STR_FEEDBACK,
  STR_CREATE_SAVING,
  STR_CREATE_INVESTMENT,
  STR_CREATE_FINANCIAL_FREEDOM_NUMBER,
  STR_CREATE_FINANCIAL_FREEDOM_PERCENT,
  STR_RETIREMENT_READNESS_CHECK
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
        newErrors[field] = (STR_REQUIRED[appContext.language]);
      }
    });

    radioFields.forEach(({ name, label }) => {
      if (form[name] !== 0 && form[name] !== 1) {
        newErrors[name] = (STR_REQUIRED[appContext.language]);
      }
    });

    if (form.loan === 1 && !form.loanAmount?.toString().trim()) {
      newErrors.loanAmount = (STR_REQUIRED[appContext.language]);
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
          <label className="form-label">{STR_CREATE_LOAN_AMOUNT[appContext.language]}</label>
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
function getBase64ImageFromUrl(imageUrl, opacity = 1) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.05;  // e.g. 0.2 for 20% opacity
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}


const handleDownloadPDF = () => {
  const doc = new jsPDF();
  const leftMargin = 10;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  let y = 20;

 getBase64ImageFromUrl('/TANZANITE SKILLS ACADEMY.png').then(bgImageData => {
    function addBackground() {
      doc.addImage(bgImageData, 'PNG', 0, 0, pageWidth, pageHeight);
    }

    addBackground(); // First page background


  // Add background on the first page before any text
  addBackground();

  // Check if adding more text will overflow page; add new page + background if needed
  function checkAddPage(lineHeight = 10) {
    if (y + lineHeight > pageHeight - 20) { // 20 = bottom margin
      doc.addPage();
      addBackground();
      y = 20; // reset y position to top margin
    }
  }

  // Utility to add label and value pair, with page break check
  function addLabelValue(label, value) {
    checkAddPage(10);
    doc.setFont(undefined, 'bold');
    doc.text(label, leftMargin, y);
    doc.setFont(undefined, 'normal');
    doc.text(value, leftMargin + 90, y);
    y += 10;
  }

 // Title
doc.setFontSize(18);
doc.text(STR_RETIREMENT_READNESS_CHECK[appContext.language], leftMargin, y);
y += 12;

doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);
doc.line(leftMargin, y, 200, y);
y += 10;

doc.setFontSize(14);
doc.setTextColor(0, 0, 0);

// Personal Details
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR_PERSONAL_DETAILS[appContext.language] + ":", leftMargin, y);
y += 8;

doc.setFont(undefined, 'normal');
addLabelValue(STR_NAME_OF_PARTICIPANT[appContext.language] + ":", results.personalDetails.name);
addLabelValue(STR_CREATE_AGE[appContext.language] + ":", results.personalDetails.age);
doc.setFont(undefined, 'small');

addLabelValue(
  STR_YEARS_LEFT_BEFORE_RETIREMENT[appContext.language] + ":  ",
String(  results.yearsLeftBeforeRetire)
);

y += 18;
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR_FINANCIAL_DETAILS_NOW[appContext.language] + ":", leftMargin, y);
y += 8;

doc.setFont(undefined, 'normal');
addLabelValue(STR_CREATE_MONTHLY_EXPENDITURE[appContext.language] + ":", String(results.personalDetails.mounthlyExpenditure));
addLabelValue(STR_CREATE_SAVING[appContext.language] + ":", String(results.personalDetails.saving));
addLabelValue(STR_CREATE_INVESTMENTS[appContext.language] + ":", String(results.personalDetails.investment));
addLabelValue(STR_CREATE_ASSERTS[appContext.language] + ":", String(results.personalDetails.asserts));
addLabelValue(
  STR_CREATE_HEALTH_INSURANCE[appContext.language] + ":",
  results.personalDetails.healthInsurance 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);
addLabelValue(
  STR_CREATE_LOAN_AMOUNT[appContext.language] + ":",
  results.personalDetails.loan === "1"
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);

y += 5;
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR__FINANCIAL_FREEDOM[appContext.language] + ":", leftMargin, y);
y += 8;

doc.setFont(undefined, 'normal');
addLabelValue(STR__FINANCIAL_FREEDOM[appContext.language] + ":", String(results.financialFreedom));
addLabelValue(STR_CREATE_FINANCIAL_FREEDOM_PERCENT[appContext.language] + ":", `${results.percentFinancialFreedom}%`);

y += 5;
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR__IMPORTANT_PREPARATION[appContext.language] + ":", leftMargin, y);
y += 8;

doc.setFont(undefined, 'normal');
addLabelValue(
  STR_CREATE_HEALTH_INSURANCE[appContext.language] + ":",
  results.personalDetails.healthInsurance 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);
addLabelValue(
  STR_CREATE_LOAN_AMOUNT[appContext.language] + ":",
  results.personalDetails.loan 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);
addLabelValue(
  STR_CREATE_PROJECTS[appContext.language] + ":",
  results.personalDetails.projects 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);

y += 5;
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR__INVESTMENT_AND_WILL_PLANS[appContext.language] + ":", leftMargin, y);
y += 8;

doc.setFont(undefined, 'normal');
addLabelValue(
  STR_CREATE_WILL_PLAN[appContext.language] + ":",
  results.personalDetails.willPlan 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);
addLabelValue(
  STR_CREATE_INVESTMENT[appContext.language] + ":",
  results.personalDetails.investmentPlan 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);
addLabelValue(
  STR_CREATE_PROJECTS[appContext.language] + ":",
  results.personalDetails.projects 
    ? STR_OPTIONS_YES[appContext.language]
    : STR_OPTIONS_NO[appContext.language]
);

y += 10;
checkAddPage(10);
doc.setFont(undefined, 'bold');
doc.text(STR_TOTAL_MARKS[appContext.language] + ":", leftMargin, y);
doc.setFont(undefined, 'normal');
doc.text(`${results.totalPercentage}%`, leftMargin + 70, y);
y += 15;

// Feedback
checkAddPage(8);
doc.setFont(undefined, 'bold');
doc.text(STR_FEEDBACK[appContext.language] + ":", leftMargin, y);
y += 8;


doc.setFontSize(12);
doc.setFont(undefined, 'normal');

// Split feedback text to fit page width
const splitFeedback = doc.splitTextToSize(results.feedback, 180);
splitFeedback.forEach(line => {
  checkAddPage(7);
  doc.text(line, leftMargin, y);
  y += 7;
});

doc.save('retirement_evaluation.pdf');

  });
};


  return (
    <div className="container mb-5 py-1">

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
      <div className="col-12 text-end mt-3">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? getInlineLoader() : STR_SUBMIT[appContext.language]}
        </button>
      </div>

      {/* Results */}
{results && (
  <div className="mt-3 p-4 mb-5 border border-success rounded bg-light">
    <h1 className="mb-3"><strong>{STR_EVALUATION_RESULT[appContext.language]}</strong></h1>

    <h3>
      <span className="badge bg-success">
        <strong>{STR_TOTAL_MARKS[appContext.language]}</strong>: {JSON.stringify(results.totalPercentage, null, 2)}%
      </span>
    </h3>

    <section className="mb-4">
      <h4 className="mb-3"><strong>{STR_NAME_OF_PARTICIPANT[appContext.language]}</strong></h4>
      <h2 className="medium">{results.personalDetails.name}</h2>
    </section>

    <section className="mb-4">
      <h4 className="mb-3"><strong>{STR_CREATE_AGE[appContext.language]}</strong></h4>
      <h2 className="medium">{results.personalDetails.age}</h2>
    </section>

    <section className="mb-4">
      <h4 className="mb-3"><strong>{STR_YEARS_LEFT_BEFORE_RETIREMENT[appContext.language]}</strong></h4>
      <h2 className="medium">{results.yearsLeftBeforeRetire}</h2>
    </section>

    <h1 className="mb-3 mt-4"><strong>{STR_FINANCIAL_DETAILS_NOW[appContext.language]}</strong></h1>
    <section className="mb-4">
      <h2 className="medium">
        <strong>{STR_CREATE_MONTHLY_EXPENDITURE[appContext.language]}</strong>: {results.personalDetails.mounthlyExpenditure}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_SAVING[appContext.language]}</strong>: {results.personalDetails.saving}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_INVESTMENT[appContext.language]}</strong>: {results.personalDetails.investment}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_ASSERTS[appContext.language]}</strong>: {results.personalDetails.asserts}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_HEALTH_INSURANCE[appContext.language]}</strong>: {results.personalDetails.healthInsurance 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_LOAN_AMOUNT[appContext.language]}</strong>: {results.personalDetails.loanAmount
}
      </h2>

      <h1 className="mb-3 mt-4"><strong>{STR__FINANCIAL_FREEDOM[appContext.language]}</strong></h1>
      <h2 className="medium">
        <strong>{STR_CREATE_FINANCIAL_FREEDOM_NUMBER[appContext.language]}</strong>: {results.mounthlyExpenditure}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_FINANCIAL_FREEDOM_PERCENT[appContext.language]}</strong>: {results.percentFinancialFreedom}
      </h2>
    </section>

    <section className="mb-4">
      <h1 className="mb-3"><strong>{STR__IMPORTANT_PREPARATION[appContext.language]}</strong></h1>
      <h2 className="medium">
        <strong>{STR_CREATE_HEALTH_INSURANCE[appContext.language]}</strong>: {results.personalDetails.healthInsurance 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_DEBTS[appContext.language]}</strong>: {results.personalDetails.loan 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_PROJECTS[appContext.language]}</strong>: {results.personalDetails.projects 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
    </section>

    <section className="mb-4">
      <h1 className="mb-3"><strong>{STR__INVESTMENT_AND_WILL_PLANS[appContext.language]}</strong></h1>
      <h2 className="medium">
        <strong>{STR_CREATE_WILL_PLAN[appContext.language]}</strong>: {results.personalDetails.willPlan 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_MONTHLY_INVESTMENT_PLAN[appContext.language]}</strong>: {results.personalDetails.mounthlyInvestmentPlan 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
      <h2 className="medium">
        <strong>{STR_CREATE_PROJECTS[appContext.language]}</strong>: {results.personalDetails.projects 
          ? STR_OPTIONS_YES[appContext.language]
          : STR_OPTIONS_NO[appContext.language]}
      </h2>
    </section>

    <section className="mt-4">
     
      <h2 className="medium" style={{ whiteSpace: 'pre-line' }}>
        {results.feedback}
      </h2>
      
    </section>

    <button className="btn btn-outline-success mt-3" onClick={handleDownloadPDF}>
      📄 Download PDF
    </button>
  </div>
)}

    </div>
  );
}
