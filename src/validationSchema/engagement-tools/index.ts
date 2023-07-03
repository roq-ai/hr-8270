import * as yup from 'yup';

export const engagementToolValidationSchema = yup.object().shape({
  tool_name: yup.string().required(),
  employee_id: yup.string().nullable(),
});
