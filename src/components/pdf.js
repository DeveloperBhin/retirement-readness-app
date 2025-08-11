import { useCallback } from 'react';
import jsPDF from 'jspdf';

export function useRetirementPdf(results) {
  return useCallback(() => {
    if (!results) return;

    const doc = new jsPDF();
    const leftMargin = 10;
    let y = 20;

    doc.setFontSize(18);
    doc.text('Retirement Evaluation Results', leftMargin, y);
    y += 12;

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, 200, y);
    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(0, 102, 0);

    const addLabelValue = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, leftMargin, y);
      doc.setFont(undefined, 'normal');
      doc.text(value, leftMargin + 70, y);
      y += 10;
    };

    // Personal Details
    doc.setFont(undefined, 'bold');
    doc.text('Personal Details:', leftMargin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    addLabelValue('Name:', results.personalDetails.name);
    addLabelValue('Age:', String(results.personalDetails.age));
    addLabelValue('Years Left Before Retirement:', String(results.yearsLeftBeforeRetire));

    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Financial Details Now:', leftMargin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    addLabelValue('Monthly Expenditure:', String(results.personalDetails.mounthlyExpenditure));
    addLabelValue('Saving:', String(results.personalDetails.saving));
    addLabelValue('Investment:', String(results.personalDetails.investment));
    addLabelValue('Assets:', String(results.personalDetails.asserts));
    addLabelValue(
      'Health Insurance:',
      results.personalDetails.healthInsurance === "1" ? 'Yes' : 'No'
    );
    addLabelValue(
      'Loan Amount:',
      results.personalDetails.loan === "1" ? 'Yes' : 'No'
    );

    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Financial Freedom:', leftMargin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    addLabelValue('Number:', String(results.financialFreedom));
    addLabelValue('Percent:', `${results.percentFinancialFreedom}%`);

    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Important Preparation:', leftMargin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    addLabelValue(
      'Health Insurance:',
      results.personalDetails.healthInsurance === "1" ? 'Yes' : 'No'
    );
    addLabelValue(
      'Loan Amount:',
      results.personalDetails.loan === "1" ? 'Yes' : 'No'
    );
    addLabelValue(
      'Projects:',
      results.personalDetails.projects === "1" ? 'Yes' : 'No'
    );

    y += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Investment and Will Plans:', leftMargin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    addLabelValue(
      'Will Plan:',
      results.personalDetails.willPlan === "1" ? 'Yes' : 'No'
    );
    addLabelValue(
      'Monthly Investment Plan:',
      results.personalDetails.investmentPlan === "1" ? 'Yes' : 'No'
    );
    addLabelValue(
      'Projects:',
      results.personalDetails.projects === "1" ? 'Yes' : 'No'
    );

    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Total Percentage:', leftMargin, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${results.totalPercentage}%`, leftMargin + 70, y);
    y += 15;

    doc.setFont(undefined, 'bold');
    doc.text('Feedback:', leftMargin, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const splitFeedback = doc.splitTextToSize(results.feedback, 180);
    doc.text(splitFeedback, leftMargin, y);

    doc.save('retirement_evaluation.pdf');
  }, [results]);
}
